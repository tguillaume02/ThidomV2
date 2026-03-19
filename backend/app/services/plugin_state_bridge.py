"""
Plugin State Bridge

Shared helper that push-based plugins (ZigBee, MQTT, RF24, etc.) call
when they receive new data from their hardware layer.  It:

1. Finds all Device rows whose plugin slug + device config match.
2. Merges the new state into device.state.
3. Commits to the database.
4. Broadcasts the update via WebSocket.
5. Triggers the scenario engine (on_device_state_changed).
6. Evaluates thermostat hysteresis / linked-sensor logic.
7. Sends a Telegram notification when device.notify_on_state_change is set.

Usage from any push-based plugin:

    from app.services.plugin_state_bridge import push_state_update

    await push_state_update("zigbee", new_state, match_fn)
"""
from __future__ import annotations

import logging
from typing import Any, Callable, Dict

from sqlalchemy import select

from app.core.database import async_session
from app.core.websocket import manager
from app.models.device import Device
from app.models.plugin import Plugin
from app.plugins.telegram_plugin import send_telegram_message
from app.services.scenario_engine import scenario_engine

logger = logging.getLogger(__name__)

# Lazy-loaded thermostat helpers (avoid circular import at module level)
_thermostat_helpers_loaded = False
_evaluate_thermostat_hysteresis = None
_check_linked_thermostat = None


def _load_thermostat_helpers():
    global _thermostat_helpers_loaded, _evaluate_thermostat_hysteresis, _check_linked_thermostat
    if _thermostat_helpers_loaded:
        return
    from app.api.routes.devices import (
        _evaluate_thermostat_hysteresis as _eth,
        _check_linked_thermostat as _clt,
    )
    _evaluate_thermostat_hysteresis = _eth
    _check_linked_thermostat = _clt
    _thermostat_helpers_loaded = True


MatchFn = Callable[[Dict[str, Any]], bool]


async def push_state_update(
    plugin_slug: str,
    new_state: Dict[str, Any],
    match_fn: MatchFn,
    *,
    merge: bool = True,
) -> int:
    """Persist *new_state* for every Device whose plugin is *plugin_slug* and
    whose config satisfies *match_fn*.

    Parameters
    ----------
    plugin_slug:
        Slug of the calling plugin (e.g. "zigbee", "mqtt", "rf24network").
    new_state:
        The state dict to store.
    match_fn:
        Predicate (device_config: dict) -> bool that selects target devices.
    merge:
        If True (default), new_state is merged into existing state.
        If False, device state is replaced entirely.

    Returns
    -------
    int  Number of devices updated.
    """
    _load_thermostat_helpers()

    updated_count = 0

    try:
        async with async_session() as db:
            # 1. Resolve plugin IDs
            result = await db.execute(
                select(Plugin.id).where(Plugin.slug == plugin_slug)
            )
            plugin_ids = [row[0] for row in result.all()]
            if not plugin_ids:
                return 0

            # 2. Load candidate devices
            result = await db.execute(
                select(Device).where(Device.plugin_id.in_(plugin_ids))
            )
            devices = result.scalars().all()

            matched_devices: list[Device] = []
            for device in devices:
                cfg = device.config or {}
                try:
                    if match_fn(cfg):
                        matched_devices.append(device)
                except Exception:
                    continue

            if not matched_devices:
                return 0

            # 3. Merge state and mark dirty
            for device in matched_devices:
                if merge:
                    device.state = {**(device.state or {}), **new_state}
                else:
                    device.state = dict(new_state)

            await db.commit()
            updated_count = len(matched_devices)

            # 4. Post-commit: broadcast, scenarios, thermostat, notifications
            for device in matched_devices:
                await db.refresh(device)

                # WebSocket broadcast
                try:
                    await manager.broadcast_device_state(device.id, device.state or {})
                except Exception:
                    logger.exception("broadcast_device_state failed for device %d", device.id)

                # Thermostat hysteresis
                if device.device_type == "thermostat" and _evaluate_thermostat_hysteresis:
                    changes = _evaluate_thermostat_hysteresis(device)
                    if changes:
                        device.state = {**(device.state or {}), **changes}
                        db.add(device)
                        await db.commit()
                        await db.refresh(device)
                        await manager.broadcast_device_state(device.id, device.state)

                # Linked-sensor -> thermostat re-evaluation
                if device.device_type == "sensor" and _check_linked_thermostat:
                    try:
                        await _check_linked_thermostat(device, db)
                    except Exception:
                        logger.exception("check_linked_thermostat failed for device %d", device.id)

                # Scenario engine trigger
                try:
                    await scenario_engine.on_device_state_changed(device.id, device.state or {})
                except Exception:
                    logger.exception("on_device_state_changed failed for device %d", device.id)

                # Telegram notification
                if device.notify_on_state_change:
                    try:
                        changes_str = ", ".join("{}={}".format(k, v) for k, v in new_state.items())
                        await send_telegram_message(
                            "ThiDom - {}\nChangement d'etat: {}".format(device.name, changes_str)
                        )
                    except Exception:
                        logger.exception("Telegram notification failed for device %d", device.id)

    except Exception:
        logger.exception("push_state_update failed for plugin '%s'", plugin_slug)

    return updated_count
