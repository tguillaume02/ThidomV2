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
MIN_REFRESH_INTERVAL = 5
MAX_TICK_SLEEP = 10


class DeviceRefreshService:
    """
    Background service that refreshes device states from their plugins
    at the interval configured in each device config.refresh_interval.
    Only devices whose plugin has needs_polling=True are polled.
    """

    def __init__(self):
        self._task: asyncio.Task | None = None
        self._running = False
        self._tick_sleep = MAX_TICK_SLEEP

    def start(self):
        if self._task is not None:
            return
        self._running = True
        self._task = asyncio.create_task(self._run_loop())
        logger.info("DeviceRefreshService started (tick_sleep=%ds)", self._tick_sleep)

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
        logger.info("DeviceRefreshService loop started")
        while self._running:
            try:
                await self._tick(schedule)
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("DeviceRefreshService tick error: %s", e, exc_info=True)
            await asyncio.sleep(self._tick_sleep)

    async def _tick(self, schedule: Dict[int, float]):
        now = asyncio.get_event_loop().time()
        smallest_interval = MAX_TICK_SLEEP

        async with async_session() as db:
            result = await db.execute(
                select(Device, Plugin)
                .join(Plugin, Device.plugin_id == Plugin.id)
                .where(Plugin.enabled == True)
            )
            rows = result.all()

            seen_ids: Set[int] = set()
            polling_count = 0

            for device, plugin in rows:
                seen_ids.add(device.id)

                # Only poll devices whose plugin needs periodic refresh
                plugin_class = PluginRegistry.get_plugin_class(plugin.slug)
                if not plugin_class or not plugin_class.needs_polling:
                    continue

                polling_count += 1
                config = device.config or {}
                interval = config.get("refresh_interval", DEFAULT_REFRESH_INTERVAL)
                if isinstance(interval, (int, float)):
                    interval = max(int(interval), MIN_REFRESH_INTERVAL)
                else:
                    interval = DEFAULT_REFRESH_INTERVAL

                # Track smallest interval to adapt tick sleep
                if interval < smallest_interval:
                    smallest_interval = interval

                if device.id not in schedule:
                    schedule[device.id] = now + interval
                    logger.info(
                        "[Refresh] Registered device %d '%s' (plugin=%s, interval=%ds, next_in=%.0fs)",
                        device.id, device.name, plugin.slug, interval, interval,
                    )
                    continue

                remaining = schedule[device.id] - now
                if remaining > 0:
                    logger.debug(
                        "[Refresh] Device %d '%s' not due yet (remaining=%.1fs)",
                        device.id, device.name, remaining,
                    )
                    continue

                logger.info(
                    "[Refresh] Polling device %d '%s' (plugin=%s, interval=%ds, overdue=%.1fs)",
                    device.id, device.name, plugin.slug, interval, -remaining,
                )

                schedule[device.id] = now + interval

                plugin_instance = await PluginRegistry.get_instance(plugin.slug)
                if not plugin_instance:
                    logger.warning("[Refresh] No plugin instance for '%s'", plugin.slug)
                    continue

                try:
                    new_state = await plugin_instance.get_state(config)
                except Exception as e:
                    logger.warning(
                        "[Refresh] get_state FAILED for device %d '%s': %s",
                        device.id, device.name, e,
                    )
                    continue

                if not isinstance(new_state, dict):
                    logger.warning(
                        "[Refresh] get_state returned non-dict for device %d '%s': %s",
                        device.id, device.name, type(new_state).__name__,
                    )
                    continue

                if not new_state:
                    logger.warning("[Refresh] get_state returned empty dict for device %d '%s'", device.id, device.name)
                    continue

                if new_state != device.state:
                    device.state = new_state
                    await db.commit()
                    await manager.broadcast_device_state(device.id, new_state)
                    logger.info(
                        "[Refresh] Device %d '%s' state UPDATED (keys=%s)",
                        device.id, device.name, list(new_state.keys()),
                    )
                else:
                    logger.debug(
                        "[Refresh] Device %d '%s' state unchanged",
                        device.id, device.name,
                    )

            if polling_count == 0:
                logger.debug("[Refresh] No polling devices found in this tick")

            for did in list(schedule.keys()):
                if did not in seen_ids:
                    logger.info("[Refresh] Removing stale device %d from schedule", did)
                    del schedule[did]

        # Adapt tick sleep: at most half the smallest interval, clamped to [1, MAX_TICK_SLEEP]
        new_sleep = max(1, min(smallest_interval // 2, MAX_TICK_SLEEP))
        if new_sleep != self._tick_sleep:
            logger.info("[Refresh] Tick sleep adjusted: %ds -> %ds (smallest_interval=%ds)", self._tick_sleep, new_sleep, smallest_interval)
            self._tick_sleep = new_sleep

    async def force_refresh(self, device_id: int):
        """Force an immediate refresh of a single device."""
        logger.info("[Refresh] Force refresh requested for device %d", device_id)
        async with async_session() as db:
            result = await db.execute(
                select(Device, Plugin)
                .join(Plugin, Device.plugin_id == Plugin.id)
                .where(Device.id == device_id)
            )
            row = result.first()
            if not row:
                logger.warning("[Refresh] Force refresh: device %d not found", device_id)
                return
            device, plugin = row
            if not plugin.enabled:
                logger.warning("[Refresh] Force refresh: plugin '%s' disabled for device %d", plugin.slug, device_id)
                return
            plugin_instance = await PluginRegistry.get_instance(plugin.slug)
            if not plugin_instance:
                logger.warning("[Refresh] Force refresh: no instance for plugin '%s'", plugin.slug)
                return
            try:
                new_state = await plugin_instance.get_state(device.config or {})
                if new_state:
                    device.state = new_state
                    await db.commit()
                    await manager.broadcast_device_state(device.id, new_state)
                    logger.info("[Refresh] Force refresh OK for device %d '%s'", device_id, device.name)
                else:
                    logger.warning("[Refresh] Force refresh: empty state for device %d", device_id)
            except Exception as e:
                logger.warning("[Refresh] Force refresh FAILED for device %d: %s", device_id, e)


device_refresh_service = DeviceRefreshService()
