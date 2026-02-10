from typing import Any, Dict, List
from app.plugins.base_plugin import BasePlugin
from app.plugins.registry import register_plugin


@register_plugin
class VirtualPlugin(BasePlugin):
    name = "Virtual"
    slug = "virtual"
    version = "1.0.0"
    description = "Virtual devices for testing and logic operations"
    category = "control"
    icon = "memory"

    _states: Dict[str, Dict[str, Any]] = {}

    def __init__(self):
        super().__init__()

    @classmethod
    def get_config_schema(cls) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "virtual_id": {
                    "type": "string",
                    "title": "Virtual Device ID",
                    "description": "Unique identifier for the virtual device"
                },
                "initial_state": {
                    "type": "object",
                    "title": "Initial State",
                    "description": "Initial state values"
                }
            },
            "required": ["virtual_id"]
        }

    @classmethod
    def get_default_config(cls) -> Dict[str, Any]:
        return {
            "virtual_id": "",
            "initial_state": {"power": "off"}
        }

    @classmethod
    def get_device_types(cls) -> List[str]:
        return ["switch", "light", "sensor", "thermostat", "variable"]

    async def initialize(self, config: Dict[str, Any]) -> bool:
        self._config = config
        return True

    async def get_state(self, device_config: Dict[str, Any]) -> Dict[str, Any]:
        vid = device_config.get("virtual_id", "unknown")
        if vid not in self._states:
            initial = device_config.get("initial_state", {"power": "off"})
            if not isinstance(initial, dict):
                initial = {"power": str(initial)}
            self._states[vid] = initial
        return self._states[vid]

    async def set_state(self, device_config: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        vid = device_config.get("virtual_id", "unknown")
        if vid not in self._states:
            self._states[vid] = {}
        self._states[vid].update(state)
        return self._states[vid]

    async def execute_action(self, device_config: Dict[str, Any], action: str, params: Dict[str, Any] = None) -> Any:
        vid = device_config.get("virtual_id", "unknown")
        current = await self.get_state(device_config)

        if action == "toggle":
            new_power = "off" if current.get("power") == "on" else "on"
            return await self.set_state(device_config, {"power": new_power})
        elif action == "turn_on":
            return await self.set_state(device_config, {"power": "on"})
        elif action == "turn_off":
            return await self.set_state(device_config, {"power": "off"})
        elif action == "set_value":
            return await self.set_state(device_config, params or {})
        return current
