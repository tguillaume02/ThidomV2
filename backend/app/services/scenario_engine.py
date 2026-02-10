"""
Scenario Engine for ThiDom
Evaluates triggers, conditions, and executes actions for scenarios.
"""
from typing import Any, Dict, List, Optional
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.scenario import Scenario
from app.models.device import Device
from app.models.plugin import Plugin
from app.plugins.registry import PluginRegistry
from app.plugins.telegram_plugin import send_telegram_message
from app.core.websocket import manager
from app.services.log_service import create_log
import logging
import asyncio
import re

logger = logging.getLogger(__name__)


def _render_template(template: str, context: Dict[str, Any]) -> str:
    """Resolve {{ device.state.field }} and {{ device.name }} placeholders.

    Supported patterns:
        {{ device.state.<field> }}   -> value from trigger device state
        {{ device.name }}            -> trigger device name
        {{ devices.<id>.state.<f> }} -> value from any device by id
        {{ devices.<id>.name }}      -> any device name by id
    """
    device_states = context.get("device_states", {})
    device_names = context.get("device_names", {})
    trigger_device_id = context.get("trigger_device_id")

    def replacer(match):
        expr = match.group(1).strip()
        parts = expr.split(".")

        try:
            # {{ device.state.humidity }} or {{ device.name }}
            if parts[0] == "device" and trigger_device_id is not None:
                if len(parts) >= 3 and parts[1] == "state":
                    field = ".".join(parts[2:])
                    state = device_states.get(trigger_device_id, {})
                    val = state.get(field)
                    return str(val) if val is not None else "?"
                elif len(parts) == 2 and parts[1] == "name":
                    return device_names.get(trigger_device_id, "?")

            # {{ devices.5.state.humidity }} or {{ devices.5.name }}
            if parts[0] == "devices" and len(parts) >= 3:
                dev_id = int(parts[1])
                if parts[2] == "state" and len(parts) >= 4:
                    field = ".".join(parts[3:])
                    state = device_states.get(dev_id, {})
                    val = state.get(field)
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

        # Ensure device_states key exists for backward compat
        if "device_states" not in context:
            context["device_states"] = await self.build_device_states(db)

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
            actual = device_state.get(field)
            operator = config.get("operator")
            value = config.get("value")
            if operator and value is not None:
                return self._compare(actual, operator, value)
            return actual is not None

        elif trigger_type == "time":
            target_time = config.get("time")
            now = datetime.now().strftime("%H:%M")
            return now == target_time

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
                actual = device_states.get(device_id, {}).get(field)
                results.append((self._compare(actual, operator, value), op))

            elif cond_type == "value_compare":
                device_id = config.get("device_id")
                field = config.get("field")
                if device_id and field:
                    actual = device_states.get(device_id, {}).get(field)
                else:
                    actual = config.get("left")
                operator = config.get("operator", "==")
                value = config.get("value", config.get("right"))
                results.append((self._compare(actual, operator, value), op))

            elif cond_type == "time_range":
                start = config.get("start", "00:00")
                end = config.get("end", "23:59")
                now = datetime.now().strftime("%H:%M")
                results.append((start <= now <= end, op))

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
        """Called when a device state changes. Evaluate scenarios with device_state triggers."""
        from app.core.database import async_session
        async with async_session() as own_db:
            result = await own_db.execute(
                select(Scenario).where(Scenario.enabled == True)
            )
            scenarios = result.scalars().all()

            context = await self.build_context(own_db, trigger_device_id=device_id)

            for scenario in scenarios:
                triggers = scenario.triggers or []
                for trigger in triggers:
                    if trigger.get("type") != "device_state":
                        continue
                    trigger_device_id = trigger.get("config", {}).get("device_id")
                    if trigger_device_id != device_id:
                        continue
                    if await self.evaluate_trigger(trigger, context):
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
                        break

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
