"""
ThiDom RF24Network Plugin - communicates with Arduino/nRF24L01+ nodes
via a USB dongle (serial gateway).

Protocol:

  - Command sent TO the dongle (action on a remote node):
        {node_id}/{guid}_{widget_id}_{pin_id}@{value}:{state}\n
    The node_id comes FIRST, before the slash.

  - Data received FROM the dongle (sensor reports / ack):
        {guid}_{widget_id}_{pin_id}@{value}:{state}/{node_id}\n
    The node_id comes LAST, after the slash.
    Examples:
        1025191933_0_0@17.87:0/01    (Temperature sensor, 17.87C, node 01)
        1025191933_9_0@3.93:0/01     (Vcc sensor, 3.93V, node 01)

Widget types (by ID):
    0 = Temperature    (read-only sensor, value = C)
    1 = Relay          (on/off switch)
    2 = Dimmer         (0-100% brightness)
    3 = RGB            (color value)
    4 = Motion         (read-only sensor, 0/1 occupancy)
    5 = Thermostat     (target temperature, on/off heating)
    6 = Humidity       (read-only sensor, value = %)
    7 = Text           (text display / info)
    8 = Commande       (generic command trigger)
    9 = Vcc            (node supply voltage, NOT a separate device)

Vcc handling:
    Widget 9 (Vcc) is a property of the node, not a standalone device.
    When a Vcc message is received for a GUID, the voltage/battery values
    are injected into the state of ALL devices sharing that same GUID.
    Example: GUID RF24A001 has a temperature sensor and a relay.
    When 'RF24A001_9_0@3.93:0/01' is received, both the temperature
    sensor and relay states get {"voltage": 3.93, "battery": 3.93}.

Hub config (plugin-level):
    serial_port   : USB serial port  (e.g. COM3, /dev/ttyUSB0)
    baud_rate     : baud rate (default 115200)

Device config (per-device):
    node_id       : RF24Network node address (octal string, e.g. "01")
    device_guid   : unique device GUID
    widget_id     : widget type identifier (see list above)
    pin_id        : pin/device id on the node
"""
from typing import Any, Dict, List, Optional
import asyncio
import logging
import os

from app.plugins.base_plugin import BasePlugin
from app.plugins.registry import register_plugin

logger = logging.getLogger(__name__)

# Widget type mapping (widget_id -> label)
WIDGET_TYPES = {
    "0": "Temperature",
    "1": "Relay",
    "2": "Dimmer",
    "3": "RGB",
    "4": "Motion",
    "5": "Thermostat",
    "6": "Humidity",
    "7": "Text",
    "8": "Commande",
    "9": "Vcc",
}

# Widget IDs that are read-only sensors (no command sent)
SENSOR_WIDGET_IDS = {"0", "4", "6", "9"}

# Widget ID -> ThiDom device_type mapping
WIDGET_DEVICE_TYPE = {
    "0": "sensor",
    "1": "switch",
    "2": "light",
    "3": "light",
    "4": "sensor",
    "5": "thermostat",
    "6": "sensor",
    "7": "sensor",
    "8": "switch",
    "9": "sensor",
}


def _build_command(node_id, guid, widget_id, pin_id, value, state):
    """Build the serial command string sent TO the dongle.

    TX format:  {node_id}/{guid}_{widget_id}_{pin_id}@{value}:{state}
    When node_id is "0" (local gateway), the prefix is omitted.
    """
    prefix = "{}/".format(node_id) if node_id and node_id != "0" else ""
    return "{}{}_{}_{}\x40{}:{}\n".format(prefix, guid, widget_id, pin_id, value, state)


def _parse_message(raw):
    """Parse an incoming serial message FROM the RF24 gateway.

    RX format:  {guid}_{widget_id}_{pin_id}@{value}:{state}/{node_id}
    The node_id is at the END, after the slash in the value:state part.

    Examples:
        1025191933_0_0@17.87:0/01
        1025191933_9_0@3.93:0/01

    Returns a dict with the parsed fields, or None on failure.
    """
    raw = raw.strip()
    if not raw:
        return None

    try:
        # Split address part (before @) and value part (after @)
        if "\x40" not in raw:
            return None
        addr_part, val_part = raw.split("\x40", 1)

        # Parse address: guid_widgetId_pinId
        parts = addr_part.split("_")
        if len(parts) < 3:
            return None
        guid = parts[0]
        widget_id = parts[1]
        pin_id = "_".join(parts[2:])

        # Parse value part: {value}:{state}/{node_id}
        # or just {value}:{state} if no node_id (local gateway)
        if "/" in val_part:
            val_state_part, node_id = val_part.rsplit("/", 1)
        else:
            val_state_part = val_part
            node_id = "0"

        # Parse value:state
        if ":" not in val_state_part:
            return None
        value_str, state = val_state_part.split(":", 1)

        try:
            value = float(value_str) if "." in value_str else int(value_str)
        except ValueError:
            value = value_str

        return {
            "node_id": node_id,
            "guid": guid,
            "widget_id": widget_id,
            "pin_id": pin_id,
            "value": value,
            "state": state,
        }
    except Exception:
        logger.debug("RF24 parse error for: %s", raw)
        return None


def _build_state_from_parsed(parsed):
    """Build a rich state dict from a parsed RF24 message, depending on widget type."""
    wid = parsed["widget_id"]
    value = parsed["value"]
    raw_state = parsed["state"]
    power = "on" if raw_state == "1" else "off"

    if wid == "0":
        return {"temperature": value, "power": "on"}
    elif wid == "1":
        return {"power": power}
    elif wid == "2":
        return {"power": power, "brightness": value}
    elif wid == "3":
        return {"power": power, "color": value}
    elif wid == "4":
        return {"occupancy": raw_state == "1", "power": "on"}
    elif wid == "5":
        return {"power": power, "target_temperature": value, "heating": raw_state == "1"}
    elif wid == "6":
        return {"humidity": value, "power": "on"}
    elif wid == "7":
        return {"text": str(value), "power": "on"}
    elif wid == "8":
        return {"power": power}
    elif wid == "9":
        return {"voltage": value, "battery": value, "power": "on"}
    else:
        return {"power": power, "value": value, "raw_state": raw_state}


@register_plugin
class RF24NetworkPlugin(BasePlugin):
    name = "RF24Network"
    slug = "rf24network"
    version = "1.0.0"
    description = "Appareils sans-fil nRF24L01+ via dongle USB (RF24Network)"
    category = "control"
    icon = "router"

    def __init__(self):
        super().__init__()
        self._reader_task = None
        self._state_cache = {}
        self._vcc_cache = {}  # guid -> {"voltage": x, "battery": x}
        self._serial_writer = None

    # ------------------------------------------------------------------
    # Hub config schema (USB serial dongle)
    # ------------------------------------------------------------------

    @classmethod
    def get_hub_config_schema(cls):
        return {
            "type": "object",
            "properties": {
                "serial_port": {
                    "type": "string",
                    "title": "Port serie USB",
                    "description": "Chemin du dongle USB (ex: COM3, /dev/ttyUSB0, /dev/ttyACM0)",
                    "format": "serial-port",
                },
                "baud_rate": {
                    "type": "integer",
                    "title": "Vitesse (baud)",
                    "description": "Vitesse de communication serie",
                    "default": 115200,
                    "enum": [9600, 19200, 38400, 57600, 115200],
                },
            },
            "required": ["serial_port"],
        }

    @classmethod
    def get_default_hub_config(cls):
        return {
            "serial_port": "",
            "baud_rate": 115200,
        }

    # ------------------------------------------------------------------
    # Per-device config schema
    # ------------------------------------------------------------------

    @classmethod
    def get_config_schema(cls):
        return {
            "type": "object",
            "properties": {
                "node_id": {
                    "type": "string",
                    "title": "Adresse du noeud",
                    "description": "Adresse RF24Network du noeud (octal, ex: 01, 011, 0111)",
                },
                "device_guid": {
                    "type": "string",
                    "title": "GUID de l'appareil",
                    "description": "Identifiant unique de l'appareil sur le noeud",
                },
                "widget_id": {
                    "type": "string",
                    "title": "Type de widget",
                    "description": "0=Temperature, 1=Relay, 2=Dimmer, 3=RGB, 4=Motion, 5=Thermostat, 6=Humidity, 7=Text, 8=Commande, 9=Vcc",
                    "enum": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
                },
                "pin_id": {
                    "type": "string",
                    "title": "ID du pin/peripherique",
                    "description": "Identifiant du pin ou peripherique sur le noeud",
                },
            },
            "required": ["node_id", "device_guid", "widget_id", "pin_id"],
        }

    @classmethod
    def get_default_config(cls):
        return {
            "node_id": "01",
            "device_guid": "",
            "widget_id": "1",
            "pin_id": "0",
        }

    @classmethod
    def get_device_types(cls):
        return ["switch", "light", "sensor", "thermostat"]

    # ------------------------------------------------------------------
    # Hub lifecycle
    # ------------------------------------------------------------------

    async def setup(self, hub_config):
        self._hub_config = hub_config
        serial_port = hub_config.get("serial_port", "")
        baud_rate = hub_config.get("baud_rate", 115200)

        if not serial_port:
            self._update_status(False, "Port serie non configure")
            return False

        try:
            await self._open_serial(serial_port, baud_rate)
            self._update_status(True, "Connecte a {} ({} baud)".format(serial_port, baud_rate))
            return True
        except Exception as exc:
            logger.error("RF24Network setup failed: %s", exc)
            self._update_status(False, "Erreur: {}".format(exc))
            return False

    async def teardown(self):
        await self._close_serial()
        self._update_status(False, "Deconnecte")

    async def test_connection(self, hub_config):
        serial_port = hub_config.get("serial_port", "")
        baud_rate = hub_config.get("baud_rate", 115200)

        if not serial_port:
            return {"connected": False, "message": "Port serie non renseigne"}

        if not os.path.exists(serial_port) and not serial_port.startswith("COM"):
            return {"connected": False, "message": "Port {} introuvable".format(serial_port)}

        try:
            import serial
            ser = serial.Serial(serial_port, baud_rate, timeout=2)
            ser.close()
            return {"connected": True, "message": "Port {} accessible ({} baud)".format(serial_port, baud_rate)}
        except ImportError:
            return {"connected": False, "message": "pyserial non installe"}
        except Exception as exc:
            return {"connected": False, "message": "Erreur: {}".format(exc)}

    async def initialize(self, config):
        self._hub_config = config
        return True

    # ------------------------------------------------------------------
    # Internal serial communication
    # ------------------------------------------------------------------

    async def _open_serial(self, port, baud_rate):
        await self._close_serial()

        import serial_asyncio

        reader, writer = await serial_asyncio.open_serial_connection(
            url=port,
            baudrate=baud_rate,
            bytesize=8,
            parity="N",
            stopbits=1,
        )
        self._serial_writer = writer
        self._reader_task = asyncio.create_task(self._read_loop(reader))
        logger.info("RF24Network serial opened: %s @ %s", port, baud_rate)

    async def _close_serial(self):
        if self._reader_task:
            self._reader_task.cancel()
            try:
                await self._reader_task
            except asyncio.CancelledError:
                pass
            self._reader_task = None
        if self._serial_writer:
            try:
                self._serial_writer.close()
            except Exception:
                pass
            self._serial_writer = None

    async def _read_loop(self, reader):
        """Continuously read lines from the serial port and update cache."""
        try:
            while True:
                line = await reader.readline()
                if not line:
                    continue
                raw = line.decode("utf-8", errors="replace").strip()
                if not raw:
                    continue

                # Broadcast raw line for live serial monitor
                try:
                    from app.core.websocket import manager as ws_manager
                    asyncio.create_task(ws_manager.broadcast({
                        "type": "serial_monitor",
                        "plugin": "rf24network",
                        "direction": "RX",
                        "raw": raw,
                    }))
                except Exception:
                    pass

                parsed = _parse_message(raw)
                if parsed:
                    guid = parsed["guid"]
                    wid = parsed["widget_id"]

                    if wid == "9":
                        # Vcc is a property of the node (GUID), not a separate device.
                        # Store in vcc_cache and inject into all devices with same GUID.
                        vcc_val = parsed["value"]
                        self._vcc_cache[guid] = {"voltage": vcc_val, "battery": vcc_val}
                        # Update all existing cached states for this GUID
                        guid_token = ":{}_".format(guid)
                        for cache_key, cache_state in self._state_cache.items():
                            if guid_token in cache_key:
                                cache_state["voltage"] = vcc_val
                                cache_state["battery"] = vcc_val
                        logger.debug("RF24 Vcc for GUID %s: %s V", guid, vcc_val)
                        # Persist Vcc into all DB devices sharing the same GUID
                        try:
                            vcc_state = {"voltage": vcc_val, "battery": vcc_val}
                            asyncio.create_task(self._persist_vcc(guid, vcc_state))
                        except Exception:
                            logger.exception("Failed to schedule Vcc persistence for GUID %s", guid)
                    else:
                        key = self._cache_key(
                            parsed["node_id"], guid, wid, parsed["pin_id"],
                        )
                        state = _build_state_from_parsed(parsed)
                        # Inject cached Vcc if available for this GUID
                        vcc = self._vcc_cache.get(guid)
                        if vcc:
                            state["voltage"] = vcc["voltage"]
                            state["battery"] = vcc["battery"]
                        self._state_cache[key] = state
                        logger.debug("RF24 received: %s -> %s", key, state)
                        # Persist to DB, broadcast via WS, trigger scenarios
                        try:
                            asyncio.create_task(self._persist_device_state(parsed, state))
                        except Exception:
                            logger.exception("Failed to schedule DB persistence for RF24 message")
                else:
                    logger.debug("RF24 unrecognised line: %s", raw)
        except asyncio.CancelledError:
            pass
        except Exception as exc:
            logger.error("RF24 reader error: %s", exc)
            self._update_status(False, "Erreur lecture serie: {}".format(exc))

    async def _send_command(self, device_config, value, state):
        """Write a command to the serial port."""
        if not self._serial_writer:
            logger.warning("RF24Network serial not connected")
            return

        node_id = device_config.get("node_id", "0")
        guid = device_config.get("device_guid", "")
        widget_id = device_config.get("widget_id", "1")
        pin_id = device_config.get("pin_id", "0")

        cmd = _build_command(node_id, guid, widget_id, pin_id, value, state)
        self._serial_writer.write(cmd.encode("utf-8"))
        await self._serial_writer.drain()
        logger.debug("RF24 sent: %s", cmd.strip())

        # Broadcast TX for live serial monitor
        try:
            from app.core.websocket import manager as ws_manager
            asyncio.create_task(ws_manager.broadcast({
                "type": "serial_monitor",
                "plugin": "rf24network",
                "direction": "TX",
                "raw": cmd.strip(),
            }))
        except Exception:
            pass

    @staticmethod
    def _cache_key(node_id, guid, widget_id, pin_id):
        return "{}:{}_{}_{}" .format(node_id, guid, widget_id, pin_id)

    def _device_cache_key(self, device_config):
        return self._cache_key(
            device_config.get("node_id", "0"),
            device_config.get("device_guid", ""),
            device_config.get("widget_id", "1"),
            device_config.get("pin_id", "0"),
        )

    # ------------------------------------------------------------------
    # Device operations
    # ------------------------------------------------------------------

    async def get_state(self, device_config):
        key = self._device_cache_key(device_config)
        cached = self._state_cache.get(key)
        if cached:
            state = dict(cached)
            # Inject latest Vcc for this GUID
            guid = device_config.get("device_guid", "")
            vcc = self._vcc_cache.get(guid)
            if vcc:
                state["voltage"] = vcc["voltage"]
                state["battery"] = vcc["battery"]
            return state
        wid = device_config.get("widget_id", "1")
        if wid == "0":
            return {"temperature": 0, "power": "unknown"}
        elif wid == "4":
            return {"occupancy": False, "power": "unknown"}
        elif wid == "6":
            return {"humidity": 0, "power": "unknown"}
        elif wid == "5":
            return {"power": "unknown", "target_temperature": 0, "heating": False}
        elif wid == "2":
            return {"power": "unknown", "brightness": 0}
        elif wid == "3":
            return {"power": "unknown", "color": 0}
        return {"power": "unknown"}

    async def set_state(self, device_config, state):
        wid = device_config.get("widget_id", "1")

        if wid in SENSOR_WIDGET_IDS:
            return await self.get_state(device_config)

        power = state.get("power", "off")
        etat = "1" if power == "on" else "0"

        if wid == "2":
            value = state.get("brightness", state.get("value", 0))
        elif wid == "3":
            value = state.get("color", state.get("value", 0))
        elif wid == "5":
            value = state.get("target_temperature", state.get("value", 0))
        else:
            value = state.get("value", 0)

        await self._send_command(device_config, value, etat)

        key = self._device_cache_key(device_config)
        new_state = _build_state_from_parsed({
            "widget_id": wid,
            "value": value,
            "state": etat,
        })
        self._state_cache[key] = new_state
        return new_state

    async def execute_action(self, device_config, action, params=None):
        wid = device_config.get("widget_id", "1")

        if action == "turn_on":
            current = await self.get_state(device_config)
            return await self.set_state(device_config, dict(current, power="on"))

        elif action == "turn_off":
            current = await self.get_state(device_config)
            return await self.set_state(device_config, dict(current, power="off"))

        elif action == "toggle":
            current = await self.get_state(device_config)
            new_power = "off" if current.get("power") == "on" else "on"
            return await self.set_state(device_config, dict(current, power=new_power))

        elif action == "set_brightness":
            value = (params or {}).get("value", 100)
            return await self.set_state(device_config, {"power": "on", "brightness": value})

        elif action == "set_color":
            value = (params or {}).get("value", 0)
            return await self.set_state(device_config, {"power": "on", "color": value})

        elif action == "set_temperature":
            target = (params or {}).get("target", 20)
            current_temp = (params or {}).get("current_temperature")
            if current_temp is not None:
                heating = target > current_temp
            else:
                heating = True
            power = "on" if heating else "off"
            return await self.set_state(device_config, {
                "power": power, "target_temperature": target,
            })

        elif action == "set_value":
            value = (params or {}).get("value", 0)
            current = await self.get_state(device_config)
            return await self.set_state(device_config, dict(current, value=value))

        return await self.get_state(device_config)

    async def _persist_device_state(self, parsed: dict, state: dict):
        """Persist a parsed RF24 device state update to DB via the shared bridge.

        If no existing device matches, auto-create one in the 'Decouverts' room.
        """
        from app.services.plugin_state_bridge import push_state_update
        guid = str(parsed.get("guid", ""))
        wid = str(parsed.get("widget_id", ""))
        pin_id = str(parsed.get("pin_id", ""))
        node_id = str(parsed.get("node_id", ""))

        def match_fn(cfg: dict) -> bool:
            if str(cfg.get("device_guid", "")) != guid:
                return False
            if str(cfg.get("widget_id", "")) != wid:
                return False
            if str(cfg.get("pin_id", "")) != pin_id:
                return False
            cfg_node = cfg.get("node_id")
            if cfg_node and str(cfg_node) != node_id:
                return False
            return True

        count = await push_state_update("rf24network", state, match_fn)

        # Auto-discover: create device if no existing one matched
        if count == 0:
            await self._auto_discover_device(parsed, state)

    async def _persist_vcc(self, guid: str, vcc_state: dict):
        """Persist Vcc voltage into all DB devices sharing the same GUID."""
        from app.services.plugin_state_bridge import push_state_update
        await push_state_update(
            "rf24network",
            vcc_state,
            lambda cfg: str(cfg.get("device_guid", "")) == guid,
        )

    # ------------------------------------------------------------------
    # Auto-discovery
    # ------------------------------------------------------------------

    async def _auto_discover_device(self, parsed: dict, state: dict):
        """Auto-create a device in the 'Decouverts' room when an unknown
        RF24 node sends data for the first time."""
        from sqlalchemy import select, func, cast, String
        from app.core.database import async_session
        from app.core.websocket import manager as ws_manager
        from app.models.device import Device
        from app.models.plugin import Plugin
        from app.models.room import Room

        guid = str(parsed.get("guid", ""))
        wid = str(parsed.get("widget_id", ""))
        pin_id = str(parsed.get("pin_id", ""))
        node_id = str(parsed.get("node_id", ""))

        widget_label = WIDGET_TYPES.get(wid, "Inconnu")
        device_type = WIDGET_DEVICE_TYPE.get(wid, "sensor")

        try:
            async with async_session() as db:
                # Find or create the "Decouverts" room
                result = await db.execute(
                    select(Room).where(Room.name == "Decouverts")
                )
                room = result.scalar_one_or_none()
                if not room:
                    room = Room(name="Decouverts", icon="search", color="#FF9800", order=999)
                    db.add(room)
                    await db.flush()

                # Find the RF24 plugin ID
                result = await db.execute(
                    select(Plugin.id).where(Plugin.slug == "rf24network")
                )
                plugin_row = result.first()
                if not plugin_row:
                    logger.warning("RF24 auto-discover: plugin not found in DB")
                    return
                plugin_id = plugin_row[0]

                # Build device config
                config = {
                    "node_id": node_id,
                    "device_guid": guid,
                    "widget_id": wid,
                    "pin_id": pin_id,
                }

                # Check if device already exists (race condition guard)
                # Use JSON_EXTRACT which works on both MariaDB and SQLite
                result = await db.execute(
                    select(Device).where(
                        Device.plugin_id == plugin_id,
                        func.json_unquote(func.json_extract(Device.config, '$.device_guid')) == guid,
                        func.json_unquote(func.json_extract(Device.config, '$.widget_id')) == wid,
                        func.json_unquote(func.json_extract(Device.config, '$.pin_id')) == pin_id,
                    )
                )
                if result.scalar_one_or_none():
                    return  # Already created by concurrent task

                # Determine icon
                icon_map = {
                    "0": "thermostat", "1": "power", "2": "lightbulb",
                    "3": "palette", "4": "sensors", "5": "thermostat",
                    "6": "water_drop", "7": "text_fields", "8": "touch_app",
                }
                icon = icon_map.get(wid, "devices")

                device = Device(
                    name="{} (Noeud {} - {})".format(widget_label, node_id, guid[-4:]),
                    device_type=device_type,
                    icon=icon,
                    room_id=room.id,
                    plugin_id=plugin_id,
                    config=config,
                    state=state,
                    is_visible=True,
                )
                db.add(device)
                await db.commit()
                await db.refresh(device)

                logger.info(
                    "RF24 auto-discovered device: %s (id=%d, guid=%s, widget=%s, node=%s)",
                    device.name, device.id, guid, wid, node_id,
                )

                # Notify frontend
                await ws_manager.broadcast({
                    "type": "device_discovered",
                    "plugin": "rf24network",
                    "device_id": device.id,
                    "device_name": device.name,
                    "device_type": device_type,
                    "node_id": node_id,
                    "guid": guid,
                    "widget": widget_label,
                })

        except Exception:
            logger.exception("RF24 auto-discover failed for GUID %s", guid)
