from typing import Dict, Optional, Type
from app.plugins.base_plugin import BasePlugin
import importlib
import logging

logger = logging.getLogger(__name__)


class PluginRegistry:
    """Registry for managing all available plugins."""

    _plugins: Dict[str, Type[BasePlugin]] = {}
    _instances: Dict[str, BasePlugin] = {}

    @classmethod
    def register(cls, plugin_class: Type[BasePlugin]):
        """Register a plugin class."""
        slug = plugin_class.slug
        cls._plugins[slug] = plugin_class
        logger.info(f"Plugin registered: {plugin_class.name} ({slug})")
        return plugin_class

    @classmethod
    def get_plugin_class(cls, slug: str) -> Optional[Type[BasePlugin]]:
        """Get a plugin class by slug."""
        return cls._plugins.get(slug)

    @classmethod
    async def get_instance(cls, slug: str, config: Dict = None) -> Optional[BasePlugin]:
        """Get or create a plugin instance."""
        if slug not in cls._instances:
            plugin_class = cls._plugins.get(slug)
            if plugin_class is None:
                return None
            instance = plugin_class()
            await instance.initialize(config or {})
            cls._instances[slug] = instance
        return cls._instances[slug]

    @classmethod
    def list_plugins(cls) -> list:
        """List all registered plugins."""
        return [
            plugin_class().get_info()
            for plugin_class in cls._plugins.values()
        ]

    @classmethod
    async def cleanup_all(cls):
        """Cleanup all plugin instances."""
        for instance in cls._instances.values():
            await instance.cleanup()
        cls._instances.clear()


def register_plugin(cls):
    """Decorator to register a plugin."""
    PluginRegistry.register(cls)
    return cls


def load_builtin_plugins():
    """Load all built-in plugins."""
    from app.plugins import mqtt_plugin
    from app.plugins import zigbee_plugin
    from app.plugins import weather_plugin
    from app.plugins import bourse_plugin
    from app.plugins import virtual_plugin
    from app.plugins import telegram_plugin
    from app.plugins import camera_plugin
    from app.plugins import rf24network_plugin
    logger.info(f"Loaded {len(PluginRegistry._plugins)} built-in plugins")
