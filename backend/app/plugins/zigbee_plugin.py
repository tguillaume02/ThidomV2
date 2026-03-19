"""
ThiDom ZigBee Plugin – communicates with ZigBee devices via a coordinator.

Supported coordinators:
  - **Zigbee2MQTT** (recommended): connects to the Z2M MQTT bridge.
  - Direct USB dongle: the serial port path is stored in hub_config so the
    future native-ZNP/EZSP driver can use it.

Hub config (plugin-level):
    coordinator_type  : "zigbee2mqtt" | "usb_dongle"
    broker_host       : MQTT broker address (for zigbee2mqtt)
    broker_port       : MQTT broker port
    username / password
    base_topic        : Z2M base topic (default "zigbee2mqtt")
    serial_port       : USB serial port (e.g. /dev/ttyUSB0, COM3) for direct dongle

Device config (per-device):
    ieee_address, friendly_name, model
"""
from typing import Any, Dict, List, Optional
import asyncio
import json
import logging

import aiomqtt

from app.plugins.base_plugin import BasePlugin
from app.plugins.registry import register_plugin

logger = logging.getLogger(__name__)

Z2M_BASE = "zigbee2mqtt"


@register_plugin
class ZigBeePlugin(BasePlugin):
    name = "ZigBee"
    slug = "zigbee"
    version = "2.0.0"
    description = "Controle d'appareils ZigBee (Zigbee2MQTT ou dongle USB)"
    category = "control"
    icon = "bluetooth"

    def __init__(self):
        super().__init__()
        self._client: Optional[aiomqtt.Client] = None
        self._listener_task: Optional[asyncio.Task] = None
        self._device_states: Dict[str, Dict[str, Any]] = {}  # friendly_name -> state
        self._bridge_online = False

    # ------------------------------------------------------------------
    # Hub config schema
    # ------------------------------------------------------------------

    @classmethod
    def get_hub_config_schema(cls) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "coordinator_type": {
                    "type": "string",
                    "title": "Type de coordinateur",
                    "enum": ["zigbee2mqtt", "usb_dongle"],
                    "default": "zigbee2mqtt",
                    "description": "zigbee2mqtt (via MQTT) ou dongle USB direct",
                },
                "broker_host": {
                    "type": "string",
                    "title": "Adresse broker MQTT",
                    "description": "Utilise par Zigbee2MQTT",
                    "default": "localhost",
                },
                "broker_port": {
                    "type": "integer",
                    "title": "Port broker MQTT",
                    "default": 1883,
                },
                "username": {"type": "string", "title": "Utilisateur MQTT"},
                "password": {"type": "string", "title": "Mot de passe MQTT", "format": "password"},
                "base_topic": {
                    "type": "string",
                    "title": "Topic de base Z2M",
                    "default": "zigbee2mqtt",
                },
                "serial_port": {
                    "type": "string",
                    "title": "Port serie USB",
                    "description": "Chemin du dongle USB (ex: /dev/ttyUSB0 ou COM3).  Utilise uniquement pour le mode dongle USB.",
                    "format": "serial-port",
                },
            },
            "required": ["coordinator_type"],
        }

    @classmethod
    def get_default_hub_config(cls) -> Dict[str, Any]:
        return {
            "coordinator_type": "zigbee2mqtt",
            "broker_host": "localhost",
            "broker_port": 1883,
            "username": "",
            "password": "",
            "base_topic": "zigbee2mqtt",
            "serial_port": "",
        }

    # ------------------------------------------------------------------
    # Device config schema
    # ------------------------------------------------------------------

    @classmethod
    def get_config_schema(cls) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "ieee_address": {
                    "type": "string",
                    "title": "Adresse IEEE",
                    "description": "Adresse IEEE du peripherique (ex: 0x00158d0001234567)",
                },
                "friendly_name": {
                    "type": "string",
                    "title": "Nom Zigbee2MQTT",
                    "description": "Nom convivial dans Zigbee2MQTT",
                },
                "model": {"type": "string", "title": "Modele"},
            },
            "required": ["friendly_name"],
        }

    @classmethod
    def get_default_config(cls) -> Dict[str, Any]:
        return {"ieee_address": "", "friendly_name": "", "model": ""}

    @classmethod
    def get_device_types(cls) -> List[str]:
        return ["light", "switch", "sensor", "thermostat", "cover", "lock"]

    # ------------------------------------------------------------------
    # Hub lifecycle
    # ------------------------------------------------------------------

    async def setup(self, hub_config: Dict[str, Any]) -> bool:
        self._hub_config = hub_config
        coord = hub_config.get("coordinator_type", "zigbee2mqtt")

        if coord == "usb_dongle":
            serial_port = hub_config.get("serial_port", "")
            if not serial_port:
                self._update_status(False, "Port serie non configure")
                return False
            # USB dongle driver not yet implemented – store the port for future use
            self._update_status(False, f"Dongle USB ({serial_port}) – driver non disponible")
            logger.warning(f"ZigBee USB dongle mode not yet implemented (port={serial_port})")
            return False

        # Zigbee2MQTT mode – connect to broker
        try:
            await self._connect()
            self._update_status(True, "Connecte a Zigbee2MQTT")
            return True
        except Exception as exc:
            logger.error(f"ZigBee setup failed: {exc}")
            self._update_status(False, f"Erreur: {exc}")
            return False

    async def teardown(self):
        await self._disconnect()
        self._update_status(False, "Deconnecte")

    async def test_connection(self, hub_config: Dict[str, Any]) -> Dict[str, Any]:
        coord = hub_config.get("coordinator_type", "zigbee2mqtt")

        if coord == "usb_dongle":
            serial_port = hub_config.get("serial_port", "")
            if not serial_port:
                return {"connected": False, "message": "Port serie non renseigne"}
            import os
            if os.path.exists(serial_port):
                return {"connected": True, "message": f"Port {serial_port} detecte (driver non disponible)"}
            return {"connected": False, "message": f"Port {serial_port} introuvable"}

        host = hub_config.get("broker_host", "localhost")
        port = hub_config.get("broker_port", 1883)
        username = hub_config.get("username") or None
        password = hub_config.get("password") or None
        base = hub_config.get("base_topic", Z2M_BASE)
        try:
            client = aiomqtt.Client(
                hostname=host, port=port,
                username=username, password=password,
                identifier=f"thidom-z2m-test-{id(self)}",
            )
            async with client:
                await client.subscribe(f"{base}/bridge/state")
                try:
                    async with asyncio.timeout(5):
                        async for msg in client.messages:
                            payload = msg.payload.decode()
                            if "online" in payload.lower():
                                return {"connected": True, "message": f"Zigbee2MQTT en ligne ({host}:{port})"}
                            return {"connected": True, "message": f"Broker accessible, bridge: {payload}"}
                except asyncio.TimeoutError:
                    return {"connected": True, "message": f"Broker accessible ({host}:{port}), bridge/state non recu"}
        except Exception as exc:
            return {"connected": False, "message": f"Echec: {exc}"}
        return {"connected": False, "message": "Erreur inconnue"}

    async def initialize(self, config: Dict[str, Any]) -> bool:
        self._hub_config = config
        return True

    # ------------------------------------------------------------------
    # Internal MQTT connection (Zigbee2MQTT bridge)
    # ------------------------------------------------------------------

    async def _connect(self):
        await self._disconnect()
        cfg = self._hub_config
        host = cfg.get("broker_host", "localhost")
        port = cfg.get("broker_port", 1883)
        base = cfg.get("base_topic", Z2M_BASE)

        self._client = aiomqtt.Client(
            hostname=host, port=port,
            username=cfg.get("username") or None,
            password=cfg.get("password") or None,
            identifier="thidom-zigbee",
            keepalive=60,
        )
        await self._client.__aenter__()
        await self._client.subscribe(f"{base}/#", qos=1)
        self._listener_task = asyncio.create_task(self._listen(base))
        logger.info(f"ZigBee2MQTT connected to {host}:{port}")

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

    async def _listen(self, base: str):
        try:
            async for message in self._client.messages:
                topic = str(message.topic)
                try:
                    payload = json.loads(message.payload.decode())
                except (json.JSONDecodeError, UnicodeDecodeError):
                    payload = message.payload.decode("utf-8", errors="replace")

                # Bridge state
                if topic == f"{base}/bridge/state":
                    online = payload == "online" or (isinstance(payload, dict) and payload.get("state") == "online")
                    self._bridge_online = online
                    if online:
                        self._update_status(True, "Zigbee2MQTT en ligne")
                    else:
                        self._update_status(False, "Zigbee2MQTT hors ligne")
                    continue

                # Device state: {base}/{friendly_name}
                if topic.startswith(f"{base}/") and "/bridge/" not in topic and isinstance(payload, dict):
                    name = topic[len(base) + 1:]
                    if "/" not in name:  # ignore /set, /get sub-topics
                        self._device_states[name] = payload
                        # Build ThiDom state (translate Z2M "state" -> "power")
                        thidom_state = dict(payload)
                        if "state" in thidom_state:
                            thidom_state["power"] = "on" if thidom_state.pop("state") == "ON" else "off"
                        # Persist to DB, broadcast via WS, trigger scenarios
                        friendly = name
                        try:
                            asyncio.create_task(self._persist_state(friendly, thidom_state))
                        except Exception:
                            logger.exception("Failed to schedule DB persistence for ZigBee device '%s'", friendly)
        except asyncio.CancelledError:
            pass
        except Exception as exc:
            logger.error(f"ZigBee listener error: {exc}")
            self._update_status(False, f"Listener error: {exc}")

    async def _persist_state(self, friendly_name: str, state: dict):
        """Persist a ZigBee device state update to DB via the shared bridge."""
        from app.services.plugin_state_bridge import push_state_update
        await push_state_update(
            "zigbee",
            state,
            lambda cfg: cfg.get("friendly_name", "") == friendly_name,
        )

    async def _publish(self, friendly_name: str, payload: Any):
        if not self._client:
            logger.warning("ZigBee2MQTT not connected")
            return
        base = self._hub_config.get("base_topic", Z2M_BASE)
        topic = f"{base}/{friendly_name}/set"
        data = json.dumps(payload) if isinstance(payload, (dict, list)) else str(payload)
        await self._client.publish(topic, data.encode(), qos=1)

    # ------------------------------------------------------------------
    # Device operations
    # ------------------------------------------------------------------

    async def get_state(self, device_config: Dict[str, Any]) -> Dict[str, Any]:
        name = device_config.get("friendly_name", "")
        if not name:
            return {"power": "unknown"}
        cached = self._device_states.get(name)
        if cached is None:
            return {"power": "unknown"}
        state = dict(cached)
        if "state" in state:
            state["power"] = "on" if state.pop("state") == "ON" else "off"
        return state

    async def set_state(self, device_config: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        name = device_config.get("friendly_name", "")
        if not name:
            return state
        z2m = dict(state)
        if "power" in z2m:
            z2m["state"] = "ON" if z2m.pop("power") == "on" else "OFF"
        await self._publish(name, z2m)
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
        elif action == "set_brightness" and params:
            return await self.set_state(device_config, {"brightness": params.get("value", 255)})
        return await self.get_state(device_config)
