"""
ThiDom MQTT Plugin – connects to a MQTT broker (local or remote)
and exposes publish/subscribe operations for devices.

Hub config (plugin-level):
    broker_host, broker_port, username, password, client_id, keepalive

Device config (per-device):
    topic_state, topic_command, payload_on, payload_off, qos, json_payload
"""
from typing import Any, Dict, List, Optional
import asyncio
import json
import logging

import aiomqtt

from app.plugins.base_plugin import BasePlugin
from app.plugins.registry import register_plugin

logger = logging.getLogger(__name__)


@register_plugin
class MQTTPlugin(BasePlugin):
    name = "MQTT"
    slug = "mqtt"
    version = "2.0.0"
    description = "Controle d'appareils via un broker MQTT"
    category = "control"
    icon = "settings_input_antenna"

    def __init__(self):
        super().__init__()
        self._client: Optional[aiomqtt.Client] = None
        self._listener_task: Optional[asyncio.Task] = None
        self._topic_cache: Dict[str, Any] = {}  # topic -> last payload

    # ------------------------------------------------------------------
    # Hub config schema (broker connection)
    # ------------------------------------------------------------------

    @classmethod
    def get_hub_config_schema(cls) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "broker_host": {
                    "type": "string",
                    "title": "Adresse du broker",
                    "description": "IP ou hostname du broker MQTT (ex: 192.168.1.10)",
                    "default": "localhost",
                },
                "broker_port": {
                    "type": "integer",
                    "title": "Port",
                    "default": 1883,
                },
                "username": {
                    "type": "string",
                    "title": "Utilisateur",
                    "description": "Optionnel",
                },
                "password": {
                    "type": "string",
                    "title": "Mot de passe",
                    "description": "Optionnel",
                    "format": "password",
                },
                "client_id": {
                    "type": "string",
                    "title": "Client ID",
                    "default": "thidom",
                },
                "keepalive": {
                    "type": "integer",
                    "title": "Keepalive (s)",
                    "default": 60,
                },
            },
            "required": ["broker_host", "broker_port"],
        }

    @classmethod
    def get_default_hub_config(cls) -> Dict[str, Any]:
        return {
            "broker_host": "localhost",
            "broker_port": 1883,
            "username": "",
            "password": "",
            "client_id": "thidom",
            "keepalive": 60,
        }

    # ------------------------------------------------------------------
    # Per-device config schema
    # ------------------------------------------------------------------

    @classmethod
    def get_config_schema(cls) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "topic_state": {
                    "type": "string",
                    "title": "Topic d'etat",
                    "description": "Topic MQTT pour lire l'etat",
                },
                "topic_command": {
                    "type": "string",
                    "title": "Topic de commande",
                    "description": "Topic MQTT pour envoyer des commandes",
                },
                "payload_on": {"type": "string", "title": "Payload ON", "default": "ON"},
                "payload_off": {"type": "string", "title": "Payload OFF", "default": "OFF"},
                "qos": {"type": "integer", "title": "QoS", "default": 0, "enum": [0, 1, 2]},
                "json_payload": {
                    "type": "boolean",
                    "title": "Payload JSON",
                    "description": "Interpreter le payload comme du JSON",
                    "default": True,
                },
            },
            "required": ["topic_state", "topic_command"],
        }

    @classmethod
    def get_default_config(cls) -> Dict[str, Any]:
        return {
            "topic_state": "",
            "topic_command": "",
            "payload_on": "ON",
            "payload_off": "OFF",
            "qos": 0,
            "json_payload": True,
        }

    @classmethod
    def get_device_types(cls) -> List[str]:
        return ["switch", "light", "sensor", "thermostat", "cover"]

    # ------------------------------------------------------------------
    # Hub lifecycle
    # ------------------------------------------------------------------

    async def setup(self, hub_config: Dict[str, Any]) -> bool:
        self._hub_config = hub_config
        try:
            await self._connect()
            self._update_status(True, "Connecte au broker")
            return True
        except Exception as exc:
            logger.error(f"MQTT setup failed: {exc}")
            self._update_status(False, f"Erreur: {exc}")
            return False

    async def teardown(self):
        await self._disconnect()
        self._update_status(False, "Deconnecte")

    async def test_connection(self, hub_config: Dict[str, Any]) -> Dict[str, Any]:
        host = hub_config.get("broker_host", "localhost")
        port = hub_config.get("broker_port", 1883)
        username = hub_config.get("username") or None
        password = hub_config.get("password") or None
        try:
            client = aiomqtt.Client(
                hostname=host, port=port,
                username=username, password=password,
                identifier=f"thidom-test-{id(self)}",
            )
            async with client:
                pass  # connection OK if no exception
            return {"connected": True, "message": f"Connexion reussie a {host}:{port}"}
        except Exception as exc:
            return {"connected": False, "message": f"Echec: {exc}"}

    async def initialize(self, config: Dict[str, Any]) -> bool:
        self._hub_config = config
        return True

    # ------------------------------------------------------------------
    # Internal MQTT connection management
    # ------------------------------------------------------------------

    async def _connect(self):
        await self._disconnect()
        cfg = self._hub_config
        self._client = aiomqtt.Client(
            hostname=cfg.get("broker_host", "localhost"),
            port=cfg.get("broker_port", 1883),
            username=cfg.get("username") or None,
            password=cfg.get("password") or None,
            identifier=cfg.get("client_id", "thidom"),
            keepalive=cfg.get("keepalive", 60),
        )
        await self._client.__aenter__()
        await self._client.subscribe("home/#", qos=1)
        self._listener_task = asyncio.create_task(self._listen())
        logger.info(f"MQTT connected to {cfg.get('broker_host')}:{cfg.get('broker_port')}")

    async def _disconnect(self):
        if self._listener_task:
            self._listener_task.cancel()
            try:
                await self._listener_task
            except asyncio.CancelledError:
                pass
            self._listener_task = None
        if self._client:
            try:
                await self._client.__aexit__(None, None, None)
            except Exception:
                pass
            self._client = None

    async def _listen(self):
        try:
            async for message in self._client.messages:
                topic = str(message.topic)
                try:
                    payload = json.loads(message.payload.decode())
                except (json.JSONDecodeError, UnicodeDecodeError):
                    payload = message.payload.decode("utf-8", errors="replace")
                self._topic_cache[topic] = payload
                # Persist to DB, broadcast via WS, trigger scenarios
                try:
                    asyncio.create_task(self._persist_state(topic, payload))
                except Exception:
                    logger.exception("Failed to schedule DB persistence for MQTT topic '%s'", topic)
        except asyncio.CancelledError:
            pass
        except Exception as exc:
            logger.error(f"MQTT listener error: {exc}")
            self._update_status(False, f"Listener error: {exc}")

    async def _persist_state(self, topic: str, payload: Any):
        """Persist an MQTT message to DB via the shared bridge."""
        from app.services.plugin_state_bridge import push_state_update

        # Build a ThiDom state dict from the payload
        if isinstance(payload, dict):
            state = dict(payload)
        else:
            state = {"raw": payload}

        def match_fn(cfg: dict) -> bool:
            topic_state = cfg.get("topic_state", "")
            if not topic_state:
                return False
            return topic_state == topic

        await push_state_update("mqtt", state, match_fn)

    async def _publish(self, topic: str, payload: Any, qos: int = 0):
        if not self._client:
            logger.warning("MQTT not connected, cannot publish")
            return
        data = json.dumps(payload) if isinstance(payload, (dict, list)) else str(payload)
        await self._client.publish(topic, data.encode(), qos=qos)

    # ------------------------------------------------------------------
    # Device operations
    # ------------------------------------------------------------------

    async def get_state(self, device_config: Dict[str, Any]) -> Dict[str, Any]:
        topic = device_config.get("topic_state", "")
        if not topic:
            return {"power": "unknown"}
        cached = self._topic_cache.get(topic)
        if cached is None:
            return {"power": "unknown"}
        if isinstance(cached, dict):
            return cached
        on = device_config.get("payload_on", "ON")
        off = device_config.get("payload_off", "OFF")
        if str(cached) == on:
            return {"power": "on"}
        if str(cached) == off:
            return {"power": "off"}
        return {"power": "unknown", "raw": cached}

    async def set_state(self, device_config: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        topic = device_config.get("topic_command", "")
        qos = device_config.get("qos", 0)
        if not topic:
            return state
        if device_config.get("json_payload", True):
            await self._publish(topic, state, qos)
        else:
            power = state.get("power", "")
            if power == "on":
                await self._publish(topic, device_config.get("payload_on", "ON"), qos)
            elif power == "off":
                await self._publish(topic, device_config.get("payload_off", "OFF"), qos)
            else:
                await self._publish(topic, state, qos)
        return state

    async def execute_action(self, device_config: Dict[str, Any], action: str, params: Dict[str, Any] = None) -> Any:
        if action == "turn_on":
            return await self.set_state(device_config, {"power": "on"})
        elif action == "turn_off":
            return await self.set_state(device_config, {"power": "off"})
        elif action == "toggle":
            cur = await self.get_state(device_config)
            new_power = "off" if cur.get("power") == "on" else "on"
            return await self.set_state(device_config, {"power": new_power})
        elif action == "publish" and params:
            topic = params.get("topic", device_config.get("topic_command", ""))
            await self._publish(topic, params.get("payload", {}), params.get("qos", 0))
            return {"published": True}
        return await self.get_state(device_config)
