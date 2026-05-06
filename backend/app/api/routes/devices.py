from typing import List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import get_current_user
from app.core.websocket import manager
from app.models.device import Device
from app.models.plugin import Plugin
from app.models.user import User
from app.schemas.device import DeviceCreate, DeviceUpdate, DeviceResponse, DeviceStateUpdate, DeviceAction
from app.plugins.registry import PluginRegistry
from app.plugins.telegram_plugin import send_telegram_message
from app.services.log_service import create_log
from app.services.scenario_engine import scenario_engine
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Plugins that push state asynchronously from hardware callbacks.
# For these, UI must wait for the real device feedback (WebSocket push)
# instead of applying an immediate optimistic state update.
PUSH_BASED_PLUGINS = {"rf24network", "zigbee", "mqtt"}


def _flatten_state_keys(data: dict, prefix: str = "") -> list[dict]:
    """Flatten a nested state dict into a list of {key, label, type} entries.

    Example: {"temperature": 12, "vigilance": {"color": "vert", "level": 2}}
    Returns: [
        {"key": "temperature", "label": "temperature", "type": "number"},
        {"key": "vigilance.color", "label": "vigilance > color", "type": "string"},
        {"key": "vigilance.level", "label": "vigilance > level", "type": "number"},
    ]
    """
    result = []
    SKIP_KEYS = {"last_refresh", "latitude", "longitude"}
    for key, value in data.items():
        full_key = f"{prefix}{key}" if not prefix else f"{prefix}.{key}"
        if full_key in SKIP_KEYS or key in SKIP_KEYS:
            continue
        if isinstance(value, dict):
            result.extend(_flatten_state_keys(value, full_key))
        elif isinstance(value, list):
            continue
        else:
            value_type = "number" if isinstance(value, (int, float)) else "boolean" if isinstance(value, bool) else "string"
            label = full_key.replace(".", " > ")
            result.append({"key": full_key, "label": label, "type": value_type})
    return result


async def _notify_state_change(device_name: str, state: dict):
    """Send a Telegram notification for a device state change (background task)."""
    changes = ", ".join(f"{k}={v}" for k, v in state.items())
    await send_telegram_message(f"🏠 ThiDom — {device_name}\nChangement d'etat: {changes}")


async def _auto_off_device(device_id: int, delay_seconds: int):
    """Wait for delay then turn off the device (background task)."""
    import asyncio
    from app.core.database import async_session
    await asyncio.sleep(delay_seconds)
    async with async_session() as db:
        result = await db.execute(select(Device).where(Device.id == device_id))
        device = result.scalar_one_or_none()
        if not device:
            return
        state = device.state or {}
        power = state.get("power", state.get("on", state.get("active", False)))
        is_on = power == "on" or power is True
        if not is_on:
            return
        # Turn off via plugin (sends actual command to device)
        off_state = {**(device.state or {}), "power": "off"}
        plugin_result = await db.execute(select(Plugin).where(Plugin.id == device.plugin_id))
        plugin_model = plugin_result.scalar_one_or_none()
        if plugin_model:
            plugin_instance = await PluginRegistry.get_instance(plugin_model.slug)
            if plugin_instance:
                off_state = await plugin_instance.set_state(device.config or {}, {"power": "off", "occupancy": False})
        device.state = {**(device.state or {}), **off_state}
        await db.commit()
        await manager.broadcast_device_state(device.id, device.state)


def _evaluate_thermostat_hysteresis(device: Device, current_temp: float | None = None) -> dict | None:
    """
    Evaluate thermostat hysteresis and return state changes if needed.
    Returns a dict with 'heating' and optionally 'power' keys, or None if no change.

    Logic:
    - If current_temp <= target - hysteresis → heating = True, power = "on"
    - If current_temp >= target + hysteresis → heating = False, power = "off"
    - Otherwise → no change (within hysteresis band)
    """
    if device.device_type != "thermostat":
        return None

    hysteresis = device.hysteresis
    if hysteresis is None or hysteresis <= 0:
        return None

    state = device.state or {}
    target = state.get("target_temperature")
    if target is None:
        return None

    # Resolve current temperature
    if current_temp is None:
        current_temp = state.get("temperature")
    if current_temp is None:
        return None

    try:
        target = float(target)
        current_temp = float(current_temp)
    except (ValueError, TypeError):
        return None

    current_heating = state.get("heating")

    if current_temp <= target - hysteresis:
        # Too cold → must heat
        if current_heating is not True:
            logger.info(
                f"Thermostat '{device.name}': {current_temp}°C <= {target - hysteresis}°C (target {target} - hyst {hysteresis}) → heating ON"
            )
            return {"heating": True, "power": "on"}
    elif current_temp >= target + hysteresis:
        # Warm enough → stop heating
        if current_heating is not False:
            logger.info(
                f"Thermostat '{device.name}': {current_temp}°C >= {target + hysteresis}°C (target {target} + hyst {hysteresis}) → heating OFF"
            )
            return {"heating": False, "power": "off"}

    return None


async def _apply_thermostat_logic(device: Device, db: AsyncSession):
    """Apply hysteresis logic after a state update on a thermostat device."""
    changes = _evaluate_thermostat_hysteresis(device)
    if changes:
        device.state = {**(device.state or {}), **changes}
        await db.commit()
        await db.refresh(device)
        await manager.broadcast_device_state(device.id, device.state)


async def _check_linked_thermostat(sensor_device: Device, db: AsyncSession):
    """
    When a sensor's temperature changes, check if any thermostat is linked to it
    and re-evaluate hysteresis.
    """
    temp = (sensor_device.state or {}).get("temperature")
    if temp is None:
        return

    # Find thermostats linked to this sensor
    result = await db.execute(
        select(Device).where(
            Device.linked_sensor_id == sensor_device.id,
            Device.device_type == "thermostat"
        )
    )
    thermostats = result.scalars().all()

    for thermostat in thermostats:
        changes = _evaluate_thermostat_hysteresis(thermostat, current_temp=float(temp))
        if changes:
            thermostat.state = {**(thermostat.state or {}), **changes}
            await manager.broadcast_device_state(thermostat.id, thermostat.state)

    if thermostats:
        await db.commit()


@router.get("/", response_model=List[DeviceResponse])
async def get_devices(room_id: int = None, db: AsyncSession = Depends(get_db)):
    query = select(Device)
    if room_id:
        query = query.where(Device.room_id == room_id)
    result = await db.execute(query.order_by(Device.order))
    return result.scalars().all()


@router.get("/{device_id}", response_model=DeviceResponse)
async def get_device(device_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Device).where(Device.id == device_id))
    device = result.scalar_one_or_none()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device


@router.post("/", response_model=DeviceResponse)
async def create_device(
    device_data: DeviceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    device = Device(**device_data.model_dump())
    db.add(device)
    await db.commit()
    await db.refresh(device)
    await create_log(db, "INFO", "user_action", f"Device '{device.name}' created", user_id=current_user.id, device_id=device.id)
    return device


@router.put("/{device_id}", response_model=DeviceResponse)
async def update_device(
    device_id: int,
    device_data: DeviceUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Device).where(Device.id == device_id))
    device = result.scalar_one_or_none()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    for key, value in device_data.model_dump(exclude_unset=True).items():
        setattr(device, key, value)

    await db.commit()
    await db.refresh(device)
    await create_log(db, "INFO", "user_action", f"Device '{device.name}' updated", user_id=current_user.id, device_id=device.id)
    return device


@router.delete("/{device_id}")
async def delete_device(
    device_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Device).where(Device.id == device_id))
    device = result.scalar_one_or_none()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    name = device.name
    await db.delete(device)
    await db.commit()
    await create_log(db, "INFO", "user_action", f"Device '{name}' deleted", user_id=current_user.id)
    return {"message": f"Device '{name}' deleted"}


@router.get("/{device_id}/state-fields")
async def get_device_state_fields(device_id: int, db: AsyncSession = Depends(get_db)):
    """Return the list of available state field keys for a device (for scenario editor)."""
    result = await db.execute(select(Device).where(Device.id == device_id))
    device = result.scalar_one_or_none()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    state = device.state or {}
    return _flatten_state_keys(state)


@router.put("/{device_id}/state", response_model=DeviceResponse)
async def update_device_state(
    device_id: int,
    state_data: DeviceStateUpdate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Device).where(Device.id == device_id))
    device = result.scalar_one_or_none()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    # Get plugin instance
    plugin_result = await db.execute(select(Plugin).where(Plugin.id == device.plugin_id))
    plugin_model = plugin_result.scalar_one_or_none()
    if plugin_model:
        plugin_instance = await PluginRegistry.get_instance(plugin_model.slug)
        if plugin_instance:
            new_state = await plugin_instance.set_state(device.config or {}, state_data.state)
            # Merge plugin result into existing state (preserve fields like voltage, battery)
            device.state = {**(device.state or {}), **new_state}
        else:
            device.state = {**(device.state or {}), **state_data.state}
    else:
        device.state = {**(device.state or {}), **state_data.state}

    # Always update last_seen timestamp
    from datetime import datetime, timezone
    device.state = {**(device.state or {}), "last_seen": datetime.now(timezone.utc).isoformat()}

    await db.commit()
    await db.refresh(device)

    # Broadcast state update via WebSocket
    await manager.broadcast_device_state(device.id, device.state)

    # Thermostat hysteresis logic
    if device.device_type == "thermostat":
        await _apply_thermostat_logic(device, db)
    elif device.device_type == "sensor":
        await _check_linked_thermostat(device, db)

    # Scenario triggers
    background_tasks.add_task(
        scenario_engine.on_device_state_changed, device.id, device.state
    )

    # Telegram notification
    if device.notify_on_state_change:
        background_tasks.add_task(_notify_state_change, device.name, state_data.state)

    # Auto-off timer: schedule turn-off after configured delay
    if device.auto_off_delay and device.auto_off_delay > 0:
        power_val = state_data.state.get("power", state_data.state.get("on", state_data.state.get("active")))
        is_on = power_val in (True, "on", "ON", 1, "1")
        if is_on:
            background_tasks.add_task(_auto_off_device, device.id, device.auto_off_delay)

    return device


@router.post("/{device_id}/action", response_model=DeviceResponse)
async def execute_device_action(
    device_id: int,
    action_data: DeviceAction,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Device).where(Device.id == device_id))
    device = result.scalar_one_or_none()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    plugin_result = await db.execute(select(Plugin).where(Plugin.id == device.plugin_id))
    plugin_model = plugin_result.scalar_one_or_none()

    new_state = None
    plugin_slug = plugin_model.slug if plugin_model else None

    if plugin_model:
        plugin_instance = await PluginRegistry.get_instance(plugin_model.slug)
        if plugin_instance:
            try:
                action_result = await plugin_instance.execute_action(
                    device.config or {}, action_data.action, action_data.params
                )
                # For push-based plugins, ignore immediate action result and
                # wait for real hardware feedback through push_state_update.
                if plugin_model.slug not in PUSH_BASED_PLUGINS and action_result:
                    new_state = action_result
            except Exception:
                new_state = None

    # Fallback: apply action directly on state only for non push-based plugins
    if not new_state and plugin_slug not in PUSH_BASED_PLUGINS:
        current_state = dict(device.state or {})
        if action_data.action == "turn_on":
            current_state["power"] = "on"
        elif action_data.action == "turn_off":
            current_state["power"] = "off"
        elif action_data.action == "toggle":
            current_state["power"] = "off" if current_state.get("power") == "on" else "on"
        elif action_data.params:
            current_state.update(action_data.params)
        new_state = current_state

    # For push-based plugins, do not mutate persisted state here.
    # Return current device as-is; frontend will update on WebSocket feedback.
    if new_state:
        device.state = {**(device.state or {}), **new_state}
        await db.commit()
        await db.refresh(device)
        await manager.broadcast_device_state(device.id, device.state)

        # Thermostat hysteresis logic after action
        if device.device_type == "thermostat":
            await _apply_thermostat_logic(device, db)

        # Scenario triggers
        background_tasks.add_task(
            scenario_engine.on_device_state_changed, device.id, device.state
        )

        # Telegram notification
        if device.notify_on_state_change:
            background_tasks.add_task(_notify_state_change, device.name, new_state)

    await create_log(
        db, "INFO", "user_action",
        f"Action '{action_data.action}' on device '{device.name}'",
        user_id=current_user.id, device_id=device.id,
        details={"action": action_data.action, "params": action_data.params, "plugin": plugin_slug}
    )
    return device
