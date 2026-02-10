"""
Periodic device state refresh service.
Polls plugin get_state() at each device's configured refresh_interval,
but ONLY for plugins that declare needs_polling = True (e.g. weather, camera).
Push-based plugins (MQTT, ZigBee, RF24, Virtual) are skipped.
"""
import asyncio
from typing import Dict, Set
from sqlalchemy import select
from app.core.database import async_session
from app.core.websocket import manager
from app.models.device import Device
from app.models.plugin import Plugin
from app.plugins.registry import PluginRegistry
import logging

logger = logging.getLogger(__name__)

DEFAULT_REFRESH_INTERVAL = 900
MIN_REFRESH_INTERVAL = 10


class DeviceRefreshService:
    """
    Background service that refreshes device states from their plugins
    at the interval configured in each device config.refresh_interval.
    Only devices whose plugin has needs_polling=True are polled.
    """

    def __init__(self):
        self._task: asyncio.Task | None = None
        self._running = False

    def start(self):
        if self._task is not None:
            return
        self._running = True
        self._task = asyncio.create_task(self._run_loop())
        logger.info("DeviceRefreshService started")

    async def stop(self):
        self._running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
            self._task = None
        logger.info("DeviceRefreshService stopped")

    async def _run_loop(self):
        schedule: Dict[int, float] = {}
        while self._running:
            try:
                await self._tick(schedule)
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("DeviceRefreshService tick error: %s", e, exc_info=True)
            await asyncio.sleep(10)

    async def _tick(self, schedule: Dict[int, float]):
        now = asyncio.get_event_loop().time()

        async with async_session() as db:
            result = await db.execute(
                select(Device, Plugin)
                .join(Plugin, Device.plugin_id == Plugin.id)
                .where(Plugin.enabled == True)
            )
            rows = result.all()

            seen_ids: Set[int] = set()

            for device, plugin in rows:
                seen_ids.add(device.id)

                # Only poll devices whose plugin needs periodic refresh
                plugin_class = PluginRegistry.get_plugin_class(plugin.slug)
                if not plugin_class or not plugin_class.needs_polling:
                    continue

                config = device.config or {}
                interval = config.get("refresh_interval", DEFAULT_REFRESH_INTERVAL)
                if isinstance(interval, (int, float)):
                    interval = max(int(interval), MIN_REFRESH_INTERVAL)
                else:
                    interval = DEFAULT_REFRESH_INTERVAL

                if device.id not in schedule:
                    schedule[device.id] = now + interval
                    continue

                if now < schedule[device.id]:
                    continue

                schedule[device.id] = now + interval

                plugin_instance = await PluginRegistry.get_instance(plugin.slug)
                if not plugin_instance:
                    continue

                try:
                    new_state = await plugin_instance.get_state(config)
                except Exception as e:
                    logger.warning("Refresh failed for device %d (%s): %s", device.id, device.name, e)
                    continue

                if not isinstance(new_state, dict):
                    continue

                if new_state and new_state != device.state:
                    device.state = new_state
                    await db.commit()
                    await manager.broadcast_device_state(device.id, new_state)
                    logger.debug("Refreshed device %d (%s)", device.id, device.name)

            for did in list(schedule.keys()):
                if did not in seen_ids:
                    del schedule[did]

    async def force_refresh(self, device_id: int):
        """Force an immediate refresh of a single device."""
        async with async_session() as db:
            result = await db.execute(
                select(Device, Plugin)
                .join(Plugin, Device.plugin_id == Plugin.id)
                .where(Device.id == device_id)
            )
            row = result.first()
            if not row:
                return
            device, plugin = row
            if not plugin.enabled:
                return
            plugin_instance = await PluginRegistry.get_instance(plugin.slug)
            if not plugin_instance:
                return
            try:
                new_state = await plugin_instance.get_state(device.config or {})
                if new_state:
                    device.state = new_state
                    await db.commit()
                    await manager.broadcast_device_state(device.id, new_state)
            except Exception as e:
                logger.warning("Force refresh failed for device %d: %s", device_id, e)


device_refresh_service = DeviceRefreshService()
