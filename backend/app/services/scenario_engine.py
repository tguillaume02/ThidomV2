"""
Scenario Engine for ThiDom
Evaluates triggers, conditions, and executes actions for scenarios.
"""
from typing import Any, Dict, List, Optional
from datetime import datetime, timezone, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.scenario import Scenario
from app.models.device import Device
from app.models.plugin import Plugin
from app.plugins.registry import PluginRegistry
from app.plugins.telegram_plugin import send_telegram_message
from app.services.email_service import send_email
from app.core.websocket import manager
from app.services.log_service import create_log
import logging
import asyncio
import re

logger = logging.getLogger(__name__)

# Day-of-week names (Monday=1 .. Sunday=7) for day_compare trigger
DAY_NAMES = {
    "lundi": 1, "mardi": 2, "mercredi": 3, "jeudi": 4,
    "vendredi": 5, "samedi": 6, "dimanche": 7,
    "monday": 1, "tuesday": 2, "wednesday": 3, "thursday": 4,
    "friday": 5, "saturday": 6, "sunday": 7,
}


def _day_to_number(val: Any) -> Optional[int]:
    """Convert a day value (name or number 1-7) to int."""
    if isinstance(val, int):
        return val
    if isinstance(val, str):
        val_lower = val.strip().lower()
        if val_lower in DAY_NAMES:
            return DAY_NAMES[val_lower]
        try:
            return int(val_lower)
        except ValueError:
            return None
    return None


def _get_nested_value(data: Dict[str, Any], field: str) -> Any:
    """Resolve a dot-notation field path against a dict.

    Examples:
        _get_nested_value({"temperature": 12}, "temperature") -> 12
        _get_nested_value({"vigilance": {"color": "vert"}}, "vigilance.color") -> "vert"
        _get_nested_value({"a": {"b": {"c": 1}}}, "a.b.c") -> 1

    Falls back to a direct key lookup so that keys containing dots still work.
    """
    if not data or not field:
        return None

    # Direct key first (backward compat for keys that literally contain dots)
    if field in data:
        return data[field]

    # Nested traversal
    parts = field.split(".")
    current: Any = data
    for part in parts:
        if isinstance(current, dict):
            current = current.get(part)
        else:
            return None
        if current is None:
            return None
    return current


def _render_template(template: str, context: Dict[str, Any]) -> str:
    """Resolve {{ device.state.field }} and {{ device.name }} placeholders.

    Supported patterns:
        {{ device.state.<field> }}   -> value from trigger device state (supports nested: device.state.vigilance.color)
        {{ device.name }}            -> trigger device name
        {{ devices.<id>.state.<f> }} -> value from any device by id (supports nested)
        {{ devices.<id>.name }}      -> any device name by id
    """
    device_states = context.get("device_states", {})
    device_names = context.get("device_names", {})
    trigger_device_id = context.get("trigger_device_id")

    def replacer(match):
        expr = match.group(1).strip()
        parts = expr.split(".")

        try:
            # {{ device.state.humidity }} or {{ device.state.vigilance.color }} or {{ device.name }}
            if parts[0] == "device" and trigger_device_id is not None:
                if len(parts) >= 3 and parts[1] == "state":
                    field = ".".join(parts[2:])
                    state = device_states.get(trigger_device_id, {})
                    val = _get_nested_value(state, field)
                    return str(val) if val is not None else "?"
                elif len(parts) == 2 and parts[1] == "name":
                    return device_names.get(trigger_device_id, "?")

            # {{ devices.5.state.vigilance.color }} or {{ devices.5.name }}
            if parts[0] == "devices" and len(parts) >= 3:
                dev_id = int(parts[1])
                if parts[2] == "state" and len(parts) >= 4:
                    field = ".".join(parts[3:])
                    state = device_states.get(dev_id, {})
                    val = _get_nested_value(state, field)
                    return str(val) if val is not None else "?"
                elif parts[2] == "name":
                    return device_names.get(dev_id, "?")
        except (ValueError, IndexError, KeyError):
            pass

        return match.group(0)  # leave unchanged if not resolved

    return re.sub(r"\{\{\s*(.+?)\s*\}\}", replacer, template)


class ScenarioEngine:
    """Engine to evaluate and execute scenarios."""

    # ------------------------------------------------------------------
    # Context helpers
    # ------------------------------------------------------------------

    async def build_context(self, db: AsyncSession, trigger_device_id: int = None) -> Dict[str, Any]:
        """Load all device states and names from DB into a context dict."""
        result = await db.execute(select(Device))
        devices = result.scalars().all()
        return {
            "device_states": {d.id: dict(d.state or {}) for d in devices},
            "device_names": {d.id: d.name for d in devices},
            "trigger_device_id": trigger_device_id,
        }

    async def build_device_states(self, db: AsyncSession) -> Dict[int, Dict[str, Any]]:
        """Load all device states from DB into a {device_id: state} dict."""
        result = await db.execute(select(Device))
        devices = result.scalars().all()
        return {d.id: dict(d.state or {}) for d in devices}

    # ------------------------------------------------------------------
    # Full scenario run
    # ------------------------------------------------------------------

    async def run_scenario(self, scenario: Scenario, db: AsyncSession,
                           context: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Evaluate conditions and execute actions for a scenario.
        Returns action results list, or empty list if conditions not met."""
        if context is None:
            context = await self.build_context(db)

        if "device_states" not in context:
            context["device_states"] = await self.build_device_states(db)

        context["scenario_meta"] = {
            "last_triggered": scenario.last_triggered,
            "trigger_count": scenario.trigger_count or 0,
        }

        conditions = scenario.conditions or []
        if not await self.evaluate_conditions(conditions, context):
            logger.debug("Scenario '%s': conditions not met, skipping", scenario.name)
            return []

        actions = scenario.actions or []
        results = await self.execute_actions(actions, db, context)

        scenario.last_triggered = datetime.now(timezone.utc)
        scenario.trigger_count = (scenario.trigger_count or 0) + 1
        await db.commit()

        logger.info("Scenario '%s' executed (%d actions)", scenario.name, len(results))
        return results

    # ------------------------------------------------------------------
    # Trigger evaluation
    # ------------------------------------------------------------------

    async def evaluate_trigger(self, trigger: Dict[str, Any], context: Dict[str, Any]) -> bool:
        """Evaluate if a trigger condition is met."""
        trigger_type = trigger.get("type", "")
        config = trigger.get("config", {})

        if trigger_type == "device_state":
            device_id = config.get("device_id")
            field = config.get("field")
            device_state = context.get("device_states", {}).get(device_id, {})
            actual = _get_nested_value(device_state, field)
            operator = config.get("operator")
            value = config.get("value")
            if operator and value is not None:
                return self._compare(actual, operator, value)
            return actual is not None

        elif trigger_type == "time":
            target_time = config.get("time")
            now = datetime.now().strftime("%H:%M")
            return now == target_time

        elif trigger_type == "day_compare":
            operator = config.get("operator", "==")
            value = config.get("value")
            today = datetime.now().isoweekday()  # 1=Monday .. 7=Sunday
            target = _day_to_number(value)
            if target is not None:
                return self._compare(today, operator, target)
            return False

        elif trigger_type == "event":
            event_name = config.get("event")
            return context.get("event") == event_name

        return False

    # ------------------------------------------------------------------
    # Condition evaluation
    # ------------------------------------------------------------------

    async def evaluate_conditions(self, conditions: List[Dict[str, Any]], context: Dict[str, Any]) -> bool:
        """Evaluate all conditions. Returns True if all conditions pass."""
        if not conditions:
            return True

        device_states = context.get("device_states", {})
        scenario_meta = context.get("scenario_meta", {})
        results = []

        for condition in conditions:
            cond_type = condition.get("type", "")
            config = condition.get("config", {})
            op = condition.get("operator", "and")

            if cond_type == "device_state":
                device_id = config.get("device_id")
                field = config.get("field")
                operator = config.get("operator", "==")
                value = config.get("value")
                actual = _get_nested_value(device_states.get(device_id, {}), field)
                results.append((self._compare(actual, operator, value), op))

            elif cond_type == "value_compare":
                device_id = config.get("device_id")
                field = config.get("field")
                if device_id and field:
                    actual = _get_nested_value(device_states.get(device_id, {}), field)
                else:
                    actual = config.get("left")
                operator = config.get("operator", "==")
                value = config.get("value", config.get("right"))
                results.append((self._compare(actual, operator, value), op))

            elif cond_type == "x_and_y":
                device_id_x = config.get("device_id_x")
                field_x = config.get("field_x")
                value_x = config.get("value_x")
                device_id_y = config.get("device_id_y")
                field_y = config.get("field_y")
                value_y = config.get("value_y")
                actual_x = _get_nested_value(device_states.get(device_id_x, {}), field_x)
                actual_y = _get_nested_value(device_states.get(device_id_y, {}), field_y)
                both = self._compare(actual_x, "==", value_x) and self._compare(actual_y, "==", value_y)
                results.append((both, op))

            elif cond_type == "compound":
                logic = config.get("logic", "and")
                sub_conditions = config.get("conditions", [])
                sub_result = await self.evaluate_conditions(sub_conditions, context)
                results.append((sub_result, op))

            elif cond_type == "last_execute":
                operator = config.get("operator", ">=")
                minutes = config.get("minutes", 0)
                last_triggered = scenario_meta.get("last_triggered")
                if last_triggered:
                    elapsed = (datetime.now(timezone.utc) - last_triggered).total_seconds() / 60
                    results.append((self._compare(elapsed, operator, minutes), op))
                else:
                    results.append((True, op))

            elif cond_type == "last_update":
                device_id = config.get("device_id")
                operator = config.get("operator", ">=")
                minutes = config.get("minutes", 0)
                state = device_states.get(device_id, {})
                last_refresh = state.get("last_refresh") or state.get("updated_at")
                if last_refresh:
                    try:
                        lr = datetime.fromisoformat(str(last_refresh).replace("Z", "+00:00"))
                        if lr.tzinfo is None:
                            lr = lr.replace(tzinfo=timezone.utc)
                        elapsed = (datetime.now(timezone.utc) - lr).total_seconds() / 60
                        results.append((self._compare(elapsed, operator, minutes), op))
                    except Exception:
                        results.append((True, op))
                else:
                    results.append((True, op))

            elif cond_type == "time_exact":
                target_time = config.get("time", "00:00")
                operator = config.get("operator", "==")
                now = datetime.now().strftime("%H:%M")
                if operator == "==":
                    results.append((now == target_time, op))
                elif operator == "!=":
                    results.append((now != target_time, op))
                elif operator == ">":
                    results.append((now > target_time, op))
                elif operator == "<":
                    results.append((now < target_time, op))
                elif operator == ">=":
                    results.append((now >= target_time, op))
                elif operator == "<=":
                    results.append((now <= target_time, op))
                else:
                    results.append((now == target_time, op))

            elif cond_type == "time_range":
                start = config.get("start", "00:00")
                end = config.get("end", "23:59")
                now = datetime.now().strftime("%H:%M")
                results.append((start <= now <= end, op))

            elif cond_type == "day_compare":
                operator = config.get("operator", "==")
                value = config.get("value")
                today = datetime.now().isoweekday()
                target = _day_to_number(value)
                if target is not None:
                    results.append((self._compare(today, operator, target), op))
                else:
                    results.append((False, op))

            else:
                logger.warning("Unknown condition type: %s", cond_type)
                results.append((True, op))

        if not results:
            return True

        final = results[0][0]
        for i in range(1, len(results)):
            val, op = results[i]
            if op == "or":
                final = final or val
            else:
                final = final and val
        return final

    # ------------------------------------------------------------------
    # Action execution
    # ------------------------------------------------------------------

    async def execute_actions(self, actions: List[Dict[str, Any]], db: AsyncSession,
                              context: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Execute a list of actions."""
        if context is None:
            context = await self.build_context(db)

        results = []
        for action in actions:
            action_type = action.get("type", "")
            config = action.get("config", {})

            try:
                if action_type == "set_device_state":
                    result = await self._action_set_device_state(config, db)
                    results.append({"action": action_type, "status": "ok", "result": result})

                elif action_type == "set_level":
                    device_id = config.get("device_id")
                    level = config.get("level", 0)
                    result = await self._action_set_device_state(
                        {"device_id": device_id, "state": {"brightness": level, "power": "on" if level > 0 else "off"}}, db
                    )
                    results.append({"action": "set_level", "status": "ok", "result": result})

                elif action_type == "set_state_timed":
                    result = await self._action_set_device_state(config, db)
                    duration = config.get("duration_minutes", 0)
                    revert_state = config.get("revert_state", {})
                    if duration > 0 and revert_state:
                        revert_config = {"device_id": config.get("device_id"), "state": revert_state}
                        asyncio.get_event_loop().call_later(
                            duration * 60,
                            lambda rc=revert_config: asyncio.create_task(
                                self._action_set_device_state_standalone(rc)
                            )
                        )
                    results.append({"action": "set_state_timed", "status": "ok",
                                    "result": result, "revert_after_minutes": duration})

                elif action_type == "delay":
                    seconds = config.get("seconds", 1)
                    await asyncio.sleep(seconds)
                    results.append({"action": "delay", "status": "ok", "seconds": seconds})

                elif action_type == "send_notification":
                    message = _render_template(config.get("message", ""), context)
                    await manager.broadcast({
                        "type": "notification",
                        "message": message,
                    })
                    tg_ok = await send_telegram_message("ThiDom\n{}".format(message))
                    results.append({
                        "action": "notification",
                        "status": "ok",
                        "message": message,
                        "telegram_sent": tg_ok,
                    })

                elif action_type == "send_telegram":
                    message = _render_template(config.get("message", ""), context)
                    tg_ok = await send_telegram_message("ThiDom\n{}".format(message))
                    if tg_ok:
                        results.append({"action": "send_telegram", "status": "ok", "message": message})
                    else:
                        results.append({"action": "send_telegram", "status": "error",
                                        "message": message, "error": "Telegram non configure ou envoi echoue"})

                elif action_type == "send_email":
                    to = config.get("to", "")
                    subject = _render_template(config.get("subject", "ThiDom"), context)
                    body = _render_template(config.get("message", ""), context)
                    ok = await send_email(to, subject, body)
                    results.append({"action": "send_email", "status": "ok" if ok else "error",
                                    "to": to, "subject": subject})

                elif action_type == "execute_scenario":
                    scenario_id = config.get("scenario_id")
                    sub_result = await self._action_execute_scenario(scenario_id, db, context)
                    results.append({"action": "execute_scenario", "status": "ok", "result": sub_result})

                else:
                    results.append({"action": action_type, "status": "unknown_action"})

            except Exception as e:
                logger.error("Action execution error: %s", e)
                results.append({"action": action_type, "status": "error", "error": str(e)})

        return results

    async def _action_set_device_state(self, config: Dict[str, Any], db: AsyncSession) -> Dict[str, Any]:
        """Set a device state as an action."""
        device_id = config.get("device_id")
        state = config.get("state", {})

        result = await db.execute(select(Device).where(Device.id == device_id))
        device = result.scalar_one_or_none()
        if not device:
            return {"error": "Device {} not found".format(device_id)}

        plugin_result = await db.execute(select(Plugin).where(Plugin.id == device.plugin_id))
        plugin_model = plugin_result.scalar_one_or_none()
        if plugin_model:
            plugin_instance = await PluginRegistry.get_instance(plugin_model.slug)
            if plugin_instance:
                new_state = await plugin_instance.set_state(device.config or {}, state)
                device.state = {**(device.state or {}), **new_state}
                await db.commit()
                await manager.broadcast_device_state(device.id, device.state)
                return device.state

        device.state = {**(device.state or {}), **state}
        await db.commit()
        await manager.broadcast_device_state(device.id, device.state)
        return device.state

    async def _action_set_device_state_standalone(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Set device state in a standalone DB session (for timed reverts)."""
        from app.core.database import async_session
        async with async_session() as db:
            return await self._action_set_device_state(config, db)

    async def _action_execute_scenario(self, scenario_id: int, db: AsyncSession,
                                       context: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Execute a sub-scenario by ID."""
        result = await db.execute(select(Scenario).where(Scenario.id == scenario_id))
        scenario = result.scalar_one_or_none()
        if not scenario:
            return [{"error": "Scenario {} not found".format(scenario_id)}]
        return await self.run_scenario(scenario, db, context)

    # ------------------------------------------------------------------
    # Device state change hook
    # ------------------------------------------------------------------

    async def on_device_state_changed(self, device_id: int, new_state: Dict[str, Any]):
        """Called when a device state changes. Evaluate scenarios with device_state triggers
        or conditions referencing this device."""
        from app.core.database import async_session
        async with async_session() as own_db:
            result = await own_db.execute(
                select(Scenario).where(Scenario.enabled == True)
            )
            scenarios = result.scalars().all()

            context = await self.build_context(own_db, trigger_device_id=device_id)

            for scenario in scenarios:
                triggered = False
                triggers = scenario.triggers or []

                if triggers:
                    # Scenario has explicit triggers — match on device_state triggers
                    for trigger in triggers:
                        if trigger.get("type") != "device_state":
                            continue
                        trigger_device_id = trigger.get("config", {}).get("device_id")
                        if trigger_device_id != device_id:
                            continue
                        if await self.evaluate_trigger(trigger, context):
                            triggered = True
                            break
                else:
                    # No triggers — check if any condition references this device
                    conditions = scenario.conditions or []
                    for cond in conditions:
                        cond_device_id = cond.get("config", {}).get("device_id")
                        if cond_device_id == device_id:
                            triggered = True
                            break

                if triggered:
                    try:
                        await self.run_scenario(scenario, own_db, context)
                        await create_log(
                            own_db, "INFO", "scenario",
                            "Scenario '{}' triggered by device state change".format(scenario.name),
                            source="scenario_engine",
                            scenario_id=scenario.id,
                            device_id=device_id,
                        )
                    except Exception as e:
                        logger.error("Error running scenario '%s': %s", scenario.name, e)

    # ------------------------------------------------------------------
    # Time trigger hook (called by scheduler)
    # ------------------------------------------------------------------

    async def on_time_trigger(self, scenario_id: int):
        """Called by the scheduler when a time-based trigger fires."""
        from app.core.database import async_session
        async with async_session() as db:
            result = await db.execute(
                select(Scenario).where(Scenario.id == scenario_id, Scenario.enabled == True)
            )
            scenario = result.scalar_one_or_none()
            if not scenario:
                return
            try:
                context = await self.build_context(db)
                results = await self.run_scenario(scenario, db, context)
                if results:
                    await create_log(
                        db, "INFO", "scenario",
                        "Scenario '{}' triggered by time schedule".format(scenario.name),
                        source="scenario_engine",
                        scenario_id=scenario.id,
                    )
            except Exception as e:
                logger.error("Error running time-triggered scenario '%s': %s", scenario.name, e)

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _compare(self, left: Any, operator: str, right: Any) -> bool:
        """Compare two values with the given operator."""
        try:
            left_num = float(left) if left is not None else None
            right_num = float(right) if right is not None else None

            if left_num is not None and right_num is not None:
                if operator == "==":
                    return left_num == right_num
                elif operator == "!=":
                    return left_num != right_num
                elif operator == ">":
                    return left_num > right_num
                elif operator == "<":
                    return left_num < right_num
                elif operator == ">=":
                    return left_num >= right_num
                elif operator == "<=":
                    return left_num <= right_num
        except (ValueError, TypeError):
            pass

        # Boolean comparison
        if isinstance(right, bool) or (isinstance(right, str) and right.lower() in ("true", "false")):
            left_bool = str(left).lower() in ("true", "1", "on")
            right_bool = str(right).lower() in ("true", "1", "on")
            if operator == "==":
                return left_bool == right_bool
            elif operator == "!=":
                return left_bool != right_bool

        # String comparison
        if operator == "==":
            return str(left) == str(right)
        elif operator == "!=":
            return str(left) != str(right)
        elif operator == "contains":
            return str(right) in str(left)

        return False


scenario_engine = ScenarioEngine()
