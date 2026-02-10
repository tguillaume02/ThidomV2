from abc import ABC, abstractmethod
from typing import Any, Dict, Optional, List
from datetime import datetime, timezone


class BasePlugin(ABC):
    """Base class for all ThiDom plugins.

    Two levels of configuration:
    - **Hub config** (plugin-level): gateway connection settings shared by all
      devices of this plugin.  Examples: MQTT broker address, ZigBee USB dongle
      serial port, Telegram bot token.  Stored in ``Plugin.hub_config``.
    - **Device config** (per-device): settings specific to a single device.
      Examples: MQTT topic, ZigBee IEEE address.  Stored in ``Device.config``.
    """

    name: str = "Base Plugin"
    slug: str = "base"
    version: str = "1.0.0"
    description: str = ""
    category: str = "control"  # "control" or "info"
    icon: str = "extension"
    needs_polling: bool = False  # True for plugins that need periodic get_state() refresh (weather, camera)

    def __init__(self):
        self._hub_config: Dict[str, Any] = {}
        self._status: Dict[str, Any] = {
            "connected": False,
            "message": "Non configure",
            "last_check": None,
        }

    # ------------------------------------------------------------------
    # Hub-level configuration schema (broker, USB port, API keys …)
    # ------------------------------------------------------------------

    @classmethod
    def get_hub_config_schema(cls) -> Dict[str, Any]:
        """JSON schema describing the hub/gateway-level settings.
        Override in sub-classes that need a hub connection."""
        return {}

    @classmethod
    def get_default_hub_config(cls) -> Dict[str, Any]:
        """Default values for hub-level settings."""
        return {}

    # ------------------------------------------------------------------
    # Device-level configuration schema (topic, address …)
    # ------------------------------------------------------------------

    @classmethod
    def get_config_schema(cls) -> Dict[str, Any]:
        """JSON schema for per-device configuration."""
        return {}

    @classmethod
    def get_default_config(cls) -> Dict[str, Any]:
        """Default values for per-device configuration."""
        return {}

    @classmethod
    def get_device_types(cls) -> List[str]:
        """Supported device types for this plugin."""
        return []

    # ------------------------------------------------------------------
    # Hub lifecycle
    # ------------------------------------------------------------------

    async def setup(self, hub_config: Dict[str, Any]) -> bool:
        """Connect to the hub/gateway using *hub_config*.
        Called at startup for enabled plugins and when the user saves new
        hub settings.  Returns ``True`` on success."""
        self._hub_config = hub_config
        self._update_status(True, "OK")
        return True

    async def teardown(self):
        """Disconnect from the hub/gateway.
        Called at shutdown or when the plugin is disabled."""
        self._update_status(False, "Arrete")

    async def test_connection(self, hub_config: Dict[str, Any]) -> Dict[str, Any]:
        """Test the hub connection *without* modifying the running state.
        Returns ``{"connected": bool, "message": str}``."""
        return {"connected": True, "message": "OK (defaut)"}

    @property
    def connection_status(self) -> Dict[str, Any]:
        return dict(self._status)

    def _update_status(self, connected: bool, message: str):
        self._status = {
            "connected": connected,
            "message": message,
            "last_check": datetime.now(timezone.utc).isoformat(),
        }

    # ------------------------------------------------------------------
    # Device operations (abstract)
    # ------------------------------------------------------------------

    @abstractmethod
    async def initialize(self, config: Dict[str, Any]) -> bool:
        """Legacy initialisation (called by the registry on first use)."""
        pass

    @abstractmethod
    async def get_state(self, device_config: Dict[str, Any]) -> Dict[str, Any]:
        pass

    @abstractmethod
    async def set_state(self, device_config: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        pass

    @abstractmethod
    async def execute_action(self, device_config: Dict[str, Any], action: str, params: Dict[str, Any] = None) -> Any:
        pass

    async def cleanup(self):
        """Cleanup resources on shutdown."""
        await self.teardown()

    # ------------------------------------------------------------------
    # Metadata
    # ------------------------------------------------------------------

    def get_info(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "slug": self.slug,
            "version": self.version,
            "description": self.description,
            "category": self.category,
            "icon": self.icon,
            "needs_polling": self.needs_polling,
            "config_schema": self.get_config_schema(),
            "default_config": self.get_default_config(),
            "hub_config_schema": self.get_hub_config_schema(),
            "default_hub_config": self.get_default_hub_config(),
            "device_types": self.get_device_types(),
            "connection_status": self.connection_status,
        }
