"""
ThiDom - Script de peuplement de la base de donnees avec des donnees de demonstration.

Usage:
    cd backend
    .\\venv\\Scripts\\activate
    python seed.py
"""

import asyncio
from datetime import datetime, timedelta, timezone
from app.core.database import init_db, async_session, engine, Base
from app.core.security import get_password_hash
from app.models.user import User
from app.models.room import Room
from app.models.plugin import Plugin
from app.models.device import Device
from app.models.scenario import Scenario
from app.models.schedule import Schedule
from app.models.log import Log


async def seed():
    # Reset database
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    print("[OK] Base de donnees reinitialisee")

    async with async_session() as db:

        # =====================================================================
        # USERS
        # =====================================================================
        admin = User(
            username="admin",
            email="admin@thidom.local",
            hashed_password=get_password_hash("admin"),
            full_name="Administrateur",
            is_admin=True,
        )
        user = User(
            username="thomas",
            email="thomas@thidom.local",
            hashed_password=get_password_hash("thomas"),
            full_name="Thomas Guillaume",
            is_admin=False,
        )
        db.add_all([admin, user])
        await db.flush()
        print(f"[OK] Utilisateurs: admin (mdp: admin), thomas (mdp: thomas)")

        # =====================================================================
        # PLUGINS
        # =====================================================================
        plugin_virtual = Plugin(
            name="Virtual",
            slug="virtual",
            description="Appareils virtuels pour tests et logique",
            version="1.0.0",
            category="control",
            icon="memory",
            enabled=True,
            config_schema={
                "type": "object",
                "properties": {
                    "initial_state": {"type": "string", "title": "Etat initial", "default": "off"},
                }
            },
            default_config={"initial_state": "off"},
        )
        plugin_mqtt = Plugin(
            name="MQTT",
            slug="mqtt",
            description="Controle d'appareils via le protocole MQTT",
            version="2.0.0",
            category="control",
            icon="settings_input_antenna",
            enabled=True,
            hub_config={
                "broker_host": "localhost",
                "broker_port": 1883,
                "username": "",
                "password": "",
                "client_id": "thidom",
                "keepalive": 60,
            },
            config_schema={
                "type": "object",
                "properties": {
                    "topic_state": {"type": "string", "title": "Topic d'etat"},
                    "topic_command": {"type": "string", "title": "Topic de commande"},
                    "payload_on": {"type": "string", "title": "Payload ON", "default": "ON"},
                    "payload_off": {"type": "string", "title": "Payload OFF", "default": "OFF"},
                    "qos": {"type": "integer", "title": "QoS", "default": 0, "enum": [0, 1, 2]},
                    "json_payload": {"type": "boolean", "title": "Payload JSON", "default": True},
                }
            },
            default_config={"topic_state": "", "topic_command": "", "payload_on": "ON", "payload_off": "OFF", "qos": 0, "json_payload": True},
        )
        plugin_zigbee = Plugin(
            name="ZigBee",
            slug="zigbee",
            description="Controle d'appareils ZigBee (Zigbee2MQTT ou dongle USB)",
            version="2.0.0",
            category="control",
            icon="bluetooth",
            enabled=True,
            hub_config={
                "coordinator_type": "zigbee2mqtt",
                "broker_host": "localhost",
                "broker_port": 1883,
                "username": "",
                "password": "",
                "base_topic": "zigbee2mqtt",
                "serial_port": "",
            },
            config_schema={
                "type": "object",
                "properties": {
                    "ieee_address": {"type": "string", "title": "Adresse IEEE"},
                    "friendly_name": {"type": "string", "title": "Nom Zigbee2MQTT"},
                    "model": {"type": "string", "title": "Modele"},
                }
            },
            default_config={"ieee_address": "", "friendly_name": "", "model": ""},
        )
        plugin_weather = Plugin(
            name="Meteo France",
            slug="weather",
            description="Meteo, previsions et alertes vigilance",
            version="1.2.0",
            category="info",
            icon="cloud",
            enabled=True,
            config_schema={
                "type": "object",
                "properties": {
                    "city": {"type": "string", "title": "Ville"},
                    "department": {"type": "string", "title": "Departement"},
                    "insee_code": {"type": "string", "title": "Code INSEE"},
                }
            },
            default_config={"city": "Paris", "department": "75", "insee_code": "75056"},
        )
        plugin_telegram = Plugin(
            name="Telegram",
            slug="telegram",
            description="Notifications via Telegram Bot API",
            version="1.0.0",
            category="info",
            icon="send",
            enabled=True,
            hub_config={
                "bot_token": "",
                "chat_id": "",
            },
            config_schema={
                "type": "object",
                "properties": {
                    "telegram_bot_token": {"type": "string", "title": "Bot Token (override)"},
                    "telegram_chat_id": {"type": "string", "title": "Chat ID (override)"},
                }
            },
            default_config={"telegram_bot_token": "", "telegram_chat_id": ""},
        )
        plugin_camera = Plugin(
            name="Camera",
            slug="camera",
            description="Cameras IP locales - proxy de flux video via le serveur",
            version="1.0.0",
            category="control",
            icon="videocam",
            enabled=True,
            config_schema={
                "type": "object",
                "properties": {
                    "stream_url": {"type": "string", "title": "URL du flux MJPEG"},
                    "snapshot_url": {"type": "string", "title": "URL snapshot JPEG"},
                    "username": {"type": "string", "title": "Utilisateur"},
                    "password": {"type": "string", "title": "Mot de passe"},
                    "refresh_interval": {"type": "integer", "title": "Intervalle snapshot (s)", "default": 5},
                }
            },
            default_config={"stream_url": "", "snapshot_url": "", "username": "", "password": "", "refresh_interval": 5},
        )
        plugin_rf24 = Plugin(
            name="RF24Network",
            slug="rf24network",
            description="Appareils sans-fil nRF24L01+ via dongle USB (RF24Network)",
            version="1.0.0",
            category="control",
            icon="router",
            enabled=True,
            hub_config={
                "serial_port": "COM3",
                "baud_rate": 115200,
            },
            config_schema={
                "type": "object",
                "properties": {
                    "node_id": {"type": "string", "title": "Adresse du noeud"},
                    "device_guid": {"type": "string", "title": "GUID de l'appareil"},
                    "widget_id": {"type": "string", "title": "Type de widget", "enum": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]},
                    "pin_id": {"type": "string", "title": "ID du pin"},
                }
            },
            default_config={"node_id": "01", "device_guid": "", "widget_id": "1", "pin_id": "0"},
        )
        db.add_all([plugin_virtual, plugin_mqtt, plugin_zigbee, plugin_weather, plugin_telegram, plugin_camera, plugin_rf24])
        await db.flush()
        print(f"[OK] Plugins: Virtual, MQTT, ZigBee, Meteo France, Telegram, Camera, RF24Network")

        # =====================================================================
        # ROOMS
        # =====================================================================
        salon = Room(name="Salon", icon="weekend", color="#4CAF50", order=0)
        cuisine = Room(name="Cuisine", icon="restaurant", color="#FF9800", order=1)
        chambre = Room(name="Chambre", icon="bed", color="#2196F3", order=2)
        sdb = Room(name="Salle de bain", icon="bathtub", color="#00BCD4", order=3)
        bureau = Room(name="Bureau", icon="computer", color="#9C27B0", order=4)
        garage = Room(name="Garage", icon="garage", color="#795548", order=5)
        jardin = Room(name="Jardin", icon="yard", color="#8BC34A", order=6)
        entree = Room(name="Entree", icon="door_front", color="#607D8B", order=7)

        db.add_all([salon, cuisine, chambre, sdb, bureau, garage, jardin, entree])
        await db.flush()
        print(f"[OK] Pieces: {', '.join([r.name for r in [salon, cuisine, chambre, sdb, bureau, garage, jardin, entree]])}")

        # =====================================================================
        # DEVICES
        # =====================================================================
        devices = [
            # --- Salon ---
            Device(
                name="Plafonnier Salon", device_type="light", icon="lightbulb",
                room_id=salon.id, plugin_id=plugin_zigbee.id, order=0,
                config={"ieee_address": "0x00158d0001a2b3c4", "friendly_name": "salon_plafonnier"},
                state={"power": "on", "brightness": 80, "color_temp": 4000},
                is_visible=True, historize=True,
            ),
            Device(
                name="Lampe de lecture", device_type="light", icon="light",
                room_id=salon.id, plugin_id=plugin_zigbee.id, order=1,
                config={"ieee_address": "0x00158d0001a2b3c5", "friendly_name": "salon_lampe_lecture"},
                state={"power": "off", "brightness": 0},
                is_visible=True, historize=False,
            ),
            Device(
                name="TV Samsung", device_type="switch", icon="tv",
                room_id=salon.id, plugin_id=plugin_mqtt.id, order=2,
                config={"topic_state": "home/salon/tv/state", "topic_command": "home/salon/tv/set", "qos": 1, "json_payload": True},
                state={"power": "on"},
                is_visible=True, historize=False,
            ),
            Device(
                name="Capteur temperature Salon", device_type="sensor", icon="thermostat",
                room_id=salon.id, plugin_id=plugin_zigbee.id, order=3,
                config={"ieee_address": "0x00158d0001a2b3c6", "friendly_name": "salon_temp"},
                state={"temperature": 21.5, "humidity": 48, "battery": 87},
                is_visible=True, historize=True,
            ),
            Device(
                name="Volet roulant Salon", device_type="cover", icon="blinds",
                room_id=salon.id, plugin_id=plugin_mqtt.id, order=4,
                config={"topic_state": "home/salon/volet/state", "topic_command": "home/salon/volet/set", "qos": 1, "json_payload": True},
                state={"position": 75, "power": "on"},
                is_visible=True, historize=True,
            ),
            Device(
                name="Thermostat Salon", device_type="thermostat", icon="thermostat",
                room_id=salon.id, plugin_id=plugin_zigbee.id, order=5,
                config={"ieee_address": "0x00158d0001a2b3c7", "friendly_name": "salon_thermostat"},
                state={"temperature": 21.5, "target_temperature": 22, "humidity": 48, "power": "on", "heating": True},
                is_visible=True, historize=True, hysteresis=0.5,
            ),

            # --- Cuisine ---
            Device(
                name="Plafonnier Cuisine", device_type="light", icon="lightbulb",
                room_id=cuisine.id, plugin_id=plugin_zigbee.id, order=0,
                config={"ieee_address": "0x00158d0002b3c4d5", "friendly_name": "cuisine_plafonnier"},
                state={"power": "on", "brightness": 100, "color_temp": 5000},
                is_visible=True, historize=False,
            ),
            Device(
                name="Capteur fumee", device_type="sensor", icon="detector_smoke",
                room_id=cuisine.id, plugin_id=plugin_zigbee.id, order=1,
                config={"ieee_address": "0x00158d0002b3c4d6", "friendly_name": "cuisine_fumee"},
                state={"smoke": False, "battery": 95},
                is_visible=True, historize=True,
            ),
            Device(
                name="Capteur temperature Cuisine", device_type="sensor", icon="thermostat",
                room_id=cuisine.id, plugin_id=plugin_zigbee.id, order=2,
                config={"ieee_address": "0x00158d0002b3c4d7", "friendly_name": "cuisine_temp"},
                state={"temperature": 22.8, "humidity": 55},
                is_visible=True, historize=True,
            ),
            Device(
                name="Prise connectee Four", device_type="switch", icon="power",
                room_id=cuisine.id, plugin_id=plugin_mqtt.id, order=3,
                config={"topic_state": "home/cuisine/four/state", "topic_command": "home/cuisine/four/set", "qos": 1, "json_payload": True},
                state={"power": "off", "consumption": 0},
                is_visible=True, historize=True,
            ),

            # --- Chambre ---
            Device(
                name="Lampe de chevet", device_type="light", icon="nightlight",
                room_id=chambre.id, plugin_id=plugin_zigbee.id, order=0,
                config={"ieee_address": "0x00158d0003c4d5e6", "friendly_name": "chambre_chevet"},
                state={"power": "off", "brightness": 30, "color": "#FFD700"},
                is_visible=True, historize=False,
            ),
            Device(
                name="Volet roulant Chambre", device_type="cover", icon="blinds",
                room_id=chambre.id, plugin_id=plugin_mqtt.id, order=1,
                config={"topic_state": "home/chambre/volet/state", "topic_command": "home/chambre/volet/set", "qos": 1, "json_payload": True},
                state={"position": 0, "power": "off"},
                is_visible=True, historize=True,
            ),
            Device(
                name="Capteur temperature Chambre", device_type="sensor", icon="thermostat",
                room_id=chambre.id, plugin_id=plugin_zigbee.id, order=2,
                config={"ieee_address": "0x00158d0003c4d5e7", "friendly_name": "chambre_temp"},
                state={"temperature": 19.2, "humidity": 52, "battery": 72},
                is_visible=True, historize=True,
            ),
            Device(
                name="Capteur ouverture fenetre", device_type="sensor", icon="sensor_door",
                room_id=chambre.id, plugin_id=plugin_zigbee.id, order=3,
                config={"ieee_address": "0x00158d0003c4d5e8", "friendly_name": "chambre_fenetre"},
                state={"contact": True, "battery": 64},
                is_visible=True, historize=True,
            ),
            Device(
                name="Thermostat Chambre", device_type="thermostat", icon="thermostat",
                room_id=chambre.id, plugin_id=plugin_zigbee.id, order=4,
                config={"ieee_address": "0x00158d0003c4d5e9", "friendly_name": "chambre_thermostat"},
                state={"temperature": 19.2, "target_temperature": 19, "humidity": 52, "power": "on", "heating": False},
                is_visible=True, historize=True, hysteresis=0.3,
            ),

            # --- Salle de bain ---
            Device(
                name="Spot Salle de bain", device_type="light", icon="lightbulb",
                room_id=sdb.id, plugin_id=plugin_zigbee.id, order=0,
                config={"ieee_address": "0x00158d0004d5e6f7", "friendly_name": "sdb_spot"},
                state={"power": "off", "brightness": 0},
                is_visible=True, historize=False,
            ),
            Device(
                name="Capteur humidite SdB", device_type="sensor", icon="water_drop",
                room_id=sdb.id, plugin_id=plugin_zigbee.id, order=1,
                config={"ieee_address": "0x00158d0004d5e6f8", "friendly_name": "sdb_humidity"},
                state={"temperature": 23.1, "humidity": 72, "battery": 80},
                is_visible=True, historize=True,
            ),
            Device(
                name="Seche-serviettes", device_type="switch", icon="dry_cleaning",
                room_id=sdb.id, plugin_id=plugin_mqtt.id, order=2,
                config={"topic_state": "home/sdb/seche_serviettes/state", "topic_command": "home/sdb/seche_serviettes/set", "qos": 1, "json_payload": True},
                state={"power": "on"},
                is_visible=True, historize=False,
            ),

            # --- Bureau ---
            Device(
                name="Lampe bureau", device_type="light", icon="desk",
                room_id=bureau.id, plugin_id=plugin_zigbee.id, order=0,
                config={"ieee_address": "0x00158d0005e6f7a8", "friendly_name": "bureau_lampe"},
                state={"power": "on", "brightness": 90, "color_temp": 6500},
                is_visible=True, historize=False,
            ),
            Device(
                name="PC Bureau", device_type="switch", icon="computer",
                room_id=bureau.id, plugin_id=plugin_virtual.id, order=1,
                config={"initial_state": {"power": "on"}},
                state={"power": "on"},
                is_visible=True, historize=False,
            ),
            Device(
                name="Capteur temperature Bureau", device_type="sensor", icon="thermostat",
                room_id=bureau.id, plugin_id=plugin_zigbee.id, order=2,
                config={"ieee_address": "0x00158d0005e6f7a9", "friendly_name": "bureau_temp"},
                state={"temperature": 23.4, "humidity": 42, "battery": 91},
                is_visible=True, historize=True,
            ),

            # --- Garage ---
            Device(
                name="Porte garage", device_type="cover", icon="garage",
                room_id=garage.id, plugin_id=plugin_mqtt.id, order=0,
                config={"topic_state": "home/garage/porte/state", "topic_command": "home/garage/porte/set", "qos": 1, "json_payload": True},
                state={"position": 0, "power": "off"},
                is_visible=True, historize=True,
            ),
            Device(
                name="Detecteur mouvement Garage", device_type="sensor", icon="motion_sensor_active",
                room_id=garage.id, plugin_id=plugin_zigbee.id, order=1,
                config={"ieee_address": "0x00158d0006f7a8b9", "friendly_name": "garage_mouvement"},
                state={"occupancy": False, "battery": 55},
                is_visible=True, historize=True,
            ),

            # --- Jardin ---
            Device(
                name="Eclairage Jardin", device_type="light", icon="outdoor_garden",
                room_id=jardin.id, plugin_id=plugin_mqtt.id, order=0,
                config={"topic_state": "home/jardin/eclairage/state", "topic_command": "home/jardin/eclairage/set", "qos": 1, "json_payload": True},
                state={"power": "off"},
                is_visible=True, historize=False,
            ),
            Device(
                name="Arrosage automatique", device_type="switch", icon="water",
                room_id=jardin.id, plugin_id=plugin_mqtt.id, order=1,
                config={"topic_state": "home/jardin/arrosage/state", "topic_command": "home/jardin/arrosage/set", "qos": 1, "json_payload": True},
                state={"power": "off"},
                is_visible=True, historize=True,
            ),
            Device(
                name="Station Meteo", device_type="sensor", icon="cloud",
                room_id=jardin.id, plugin_id=plugin_weather.id, order=2,
                config={
                    "provider": "meteofrance", "city": "Paris",
                    "show_sunrise_sunset": True, "show_vigilance": True,
                    "show_season": True, "show_school_holidays": True, "show_weekend": True,
                    "refresh_interval": 900,
                },
                state={
                    "temperature": 15.3, "humidity": 68, "wind_speed": 12,
                    "condition": "Nuageux", "pressure": 1015,
                    "sunrise": "07:42", "sunset": "18:15",
                    "season": "Hiver", "is_weekend": False, "day_name": "Lundi",
                    "is_school_holiday": False, "school_holiday": None,
                    "vigilance": {
                        "department": "75", "level": 2, "color": "jaune",
                        "alerts": [
                            {"risk_id": "2", "risk_name": "Pluie-Inondation", "level": 2, "color": "jaune"}
                        ]
                    },
                },
                is_visible=True, historize=True,
            ),

            # --- Entree ---
            Device(
                name="Eclairage Entree", device_type="light", icon="lightbulb",
                room_id=entree.id, plugin_id=plugin_zigbee.id, order=0,
                config={"ieee_address": "0x00158d0008a9b0c1", "friendly_name": "entree_lumiere"},
                state={"power": "on", "brightness": 60},
                is_visible=True, historize=False,
            ),
            Device(
                name="Serrure connectee", device_type="lock", icon="lock",
                room_id=entree.id, plugin_id=plugin_mqtt.id, order=1,
                config={"topic_state": "home/entree/serrure/state", "topic_command": "home/entree/serrure/set", "qos": 1, "json_payload": True},
                state={"locked": True, "battery": 78},
                is_visible=True, historize=True,
            ),
            Device(
                name="Detecteur mouvement Entree", device_type="sensor", icon="motion_sensor_active",
                room_id=entree.id, plugin_id=plugin_zigbee.id, order=2,
                config={"ieee_address": "0x00158d0008a9b0c2", "friendly_name": "entree_mouvement"},
                state={"occupancy": False, "battery": 82},
                is_visible=True, historize=True,
            ),
            Device(
                name="Camera Entree", device_type="camera", icon="videocam",
                room_id=entree.id, plugin_id=plugin_camera.id, order=3,
                config={
                    "stream_url": "http://192.168.1.50:8080/video",
                    "snapshot_url": "http://192.168.1.50:8080/shot.jpg",
                    "refresh_interval": 5,
                },
                state={"power": "on", "reachable": True, "recording": True},
                is_visible=True, historize=False,
            ),

            # --- Garage (camera) ---
            Device(
                name="Camera Garage", device_type="camera", icon="videocam",
                room_id=garage.id, plugin_id=plugin_camera.id, order=2,
                config={
                    "stream_url": "http://192.168.1.51:8080/video",
                    "snapshot_url": "http://192.168.1.51:8080/shot.jpg",
                    "refresh_interval": 10,
                },
                state={"power": "on", "reachable": True, "recording": False},
                is_visible=True, historize=False,
            ),

            # --- RF24Network devices ---
            Device(
                name="Relais Garage RF24", device_type="switch", icon="power",
                room_id=garage.id, plugin_id=plugin_rf24.id, order=3,
                config={"node_id": "01", "device_guid": "RF24A001", "widget_id": "1", "pin_id": "2"},
                state={"power": "off", "voltage": 3.28, "battery": 3.28},
                is_visible=True, historize=True,
            ),
            Device(
                name="Sonde Temp Garage RF24", device_type="sensor", icon="thermostat",
                room_id=garage.id, plugin_id=plugin_rf24.id, order=4,
                config={"node_id": "01", "device_guid": "RF24A001", "widget_id": "0", "pin_id": "A0"},
                state={"temperature": 14.5, "power": "on", "voltage": 3.28, "battery": 3.28},
                is_visible=True, historize=True,
            ),
            Device(
                name="Eclairage Atelier RF24", device_type="light", icon="lightbulb",
                room_id=garage.id, plugin_id=plugin_rf24.id, order=5,
                config={"node_id": "011", "device_guid": "RF24B002", "widget_id": "2", "pin_id": "3"},
                state={"power": "on", "brightness": 75},
                is_visible=True, historize=False,
            ),
            Device(
                name="Thermostat Atelier RF24", device_type="thermostat", icon="thermostat",
                room_id=garage.id, plugin_id=plugin_rf24.id, order=6,
                config={"node_id": "011", "device_guid": "RF24B002", "widget_id": "5", "pin_id": "5"},
                state={"power": "on", "target_temperature": 19, "heating": True},
                is_visible=True, historize=True, hysteresis=0.5,
            ),
            Device(
                name="Detecteur mouvement Atelier RF24", device_type="sensor", icon="motion_sensor_active",
                room_id=garage.id, plugin_id=plugin_rf24.id, order=7,
                config={"node_id": "011", "device_guid": "RF24B002", "widget_id": "4", "pin_id": "7"},
                state={"occupancy": False, "power": "on"},
                is_visible=True, historize=True,
            ),
            Device(
                name="Sonde Humidite Garage RF24", device_type="sensor", icon="water_drop",
                room_id=garage.id, plugin_id=plugin_rf24.id, order=8,
                config={"node_id": "01", "device_guid": "RF24A001", "widget_id": "6", "pin_id": "A1"},
                state={"humidity": 62, "power": "on", "voltage": 3.28, "battery": 3.28},
                is_visible=True, historize=True,
            ),

        ]

        db.add_all(devices)
        await db.flush()
        print(f"[OK] Appareils: {len(devices)} appareils crees")

        # Link thermostats to their temperature sensors
        devices[5].linked_sensor_id = devices[3].id   # Thermostat Salon -> Capteur temperature Salon
        devices[14].linked_sensor_id = devices[12].id  # Thermostat Chambre -> Capteur temperature Chambre
        await db.flush()
        print(f"[OK] Thermostats lies aux capteurs de temperature")

        # =====================================================================
        # SCENARIOS
        # =====================================================================
        now = datetime.now(timezone.utc)

        scenarios = [
            Scenario(
                name="Reveil matin",
                description="Ouvre les volets et allume les lumieres a 7h",
                enabled=True,
                triggers=[{"type": "time", "config": {"time": "07:00"}}],
                conditions=[],
                actions=[
                    {"type": "set_device_state", "config": {"device_id": devices[11].id, "state": {"position": 100, "power": "on"}}},
                    {"type": "delay", "config": {"seconds": 5}},
                    {"type": "set_device_state", "config": {"device_id": devices[10].id, "state": {"power": "on", "brightness": 50}}},
                ],
                last_triggered=now - timedelta(hours=5),
                trigger_count=142,
            ),
            Scenario(
                name="Mode Nuit",
                description="Eteint toutes les lumieres, ferme les volets, verrouille la porte",
                enabled=True,
                triggers=[{"type": "time", "config": {"time": "23:00"}}],
                conditions=[],
                actions=[
                    {"type": "set_device_state", "config": {"device_id": devices[0].id, "state": {"power": "off"}}},
                    {"type": "set_device_state", "config": {"device_id": devices[6].id, "state": {"power": "off"}}},
                    {"type": "set_device_state", "config": {"device_id": devices[10].id, "state": {"power": "off"}}},
                    {"type": "set_device_state", "config": {"device_id": devices[4].id, "state": {"position": 0, "power": "off"}}},
                    {"type": "set_device_state", "config": {"device_id": devices[11].id, "state": {"position": 0, "power": "off"}}},
                    {"type": "set_device_state", "config": {"device_id": devices[27].id, "state": {"locked": True}}},
                ],
                last_triggered=now - timedelta(hours=9),
                trigger_count=98,
            ),
            Scenario(
                name="Alerte humidite SdB",
                description="Alerte si l'humidite de la salle de bain depasse 80%",
                enabled=True,
                triggers=[{"type": "device_state", "config": {"device_id": devices[16].id, "field": "humidity"}}],
                conditions=[{"type": "value_compare", "config": {"device_id": devices[16].id, "field": "humidity", "operator": ">", "value": 80}, "operator": "and"}],
                actions=[
                    {"type": "send_notification", "config": {"message": "Humidite SdB elevee: {{ device.state.humidity }}%"}},
                ],
                last_triggered=now - timedelta(days=2),
                trigger_count=7,
            ),
            Scenario(
                name="Eclairage auto Entree",
                description="Allume l'entree quand un mouvement est detecte, eteint apres 5min",
                enabled=True,
                triggers=[{"type": "device_state", "config": {"device_id": devices[28].id, "field": "occupancy"}}],
                conditions=[{"type": "device_state", "config": {"device_id": devices[28].id, "field": "occupancy", "operator": "==", "value": True}, "operator": "and"}],
                actions=[
                    {"type": "set_device_state", "config": {"device_id": devices[26].id, "state": {"power": "on", "brightness": 100}}},
                    {"type": "delay", "config": {"seconds": 300}},
                    {"type": "set_device_state", "config": {"device_id": devices[26].id, "state": {"power": "off"}}},
                ],
                last_triggered=now - timedelta(hours=1),
                trigger_count=534,
            ),
            Scenario(
                name="Anti-gel jardin",
                description="Coupe l'arrosage si temperature exterieure < 3C",
                enabled=True,
                triggers=[{"type": "device_state", "config": {"device_id": devices[25].id, "field": "temperature"}}],
                conditions=[{"type": "value_compare", "config": {"device_id": devices[25].id, "field": "temperature", "operator": "<", "value": 3}, "operator": "and"}],
                actions=[
                    {"type": "set_device_state", "config": {"device_id": devices[24].id, "state": {"power": "off"}}},
                    {"type": "send_notification", "config": {"message": "Arrosage coupe - risque de gel ({{ device.state.temperature }}C)"}},
                ],
                last_triggered=now - timedelta(days=15),
                trigger_count=3,
            ),
        ]

        db.add_all(scenarios)
        await db.flush()
        print(f"[OK] Scenarios: {len(scenarios)} scenarios crees")

        # =====================================================================
        # SCHEDULES
        # =====================================================================
        schedules = [
            Schedule(
                name="Ouverture volets matin",
                description="Ouvre tous les volets a 7h30 en semaine",
                schedule_type="weekly",
                time="07:30",
                days_of_week=[0, 1, 2, 3, 4],
                timezone="Europe/Paris",
                action={"type": "set_device_state", "targets":
                    [{"device_id": devices[4].id, "state": {"position": 100, "power": "on"}},
                    {"device_id": devices[11].id, "state": {"position": 100, "power": "on"}}]},
                enabled=True,
                last_run=now - timedelta(hours=4),
            ),
            Schedule(
                name="Fermeture volets soir",
                description="Ferme tous les volets a 21h tous les jours",
                schedule_type="daily",
                time="21:00",
                timezone="Europe/Paris",
                action={"type": "set_device_state", "targets":
                    [{"device_id": devices[4].id, "state": {"position": 0, "power": "off"}},
                    {"device_id": devices[11].id, "state": {"position": 0, "power": "off"}}]},
                enabled=True,
                last_run=now - timedelta(hours=11),
            ),
            Schedule(
                name="Arrosage jardin",
                description="Arrosage automatique a 6h les mardi et samedi",
                schedule_type="weekly",
                time="06:00",
                days_of_week=[1, 5],
                timezone="Europe/Paris",
                action={"type": "set_device_state", "targets":
                    [{"device_id": devices[24].id, "state": {"power": "on"}}]},
                enabled=True,
                last_run=now - timedelta(days=3),
            ),
            Schedule(
                name="Chauffage eco nuit",
                description="Reduction du chauffage a 18C la nuit (cron)",
                schedule_type="cron",
                cron_expression="0 23 * * *",
                timezone="Europe/Paris",
                action={"type": "set_device_state", "targets":
                    [{"device_id": devices[5].id, "state": {"target_temperature": 18}}]},
                enabled=True,
                last_run=now - timedelta(hours=9),
            ),
        ]

        db.add_all(schedules)
        await db.flush()
        print(f"[OK] Planifications: {len(schedules)} planifications creees")

        # =====================================================================
        # LOGS
        # =====================================================================
        logs = [
            Log(level="INFO", category="system", source="main",
                message="ThiDom demarre", details={"version": "1.0.0"}),
            Log(level="INFO", category="system", source="database",
                message="Base de donnees initialisee"),
            Log(level="INFO", category="user_action", source="auth",
                message="Utilisateur admin connecte", user_id=admin.id),
            Log(level="INFO", category="user_action", source="rooms",
                message="Piece 'Salon' creee", user_id=admin.id),
            Log(level="INFO", category="user_action", source="devices",
                message="Appareil 'Plafonnier Salon' cree", user_id=admin.id, device_id=devices[0].id),
            Log(level="INFO", category="scenario", source="scenario_engine",
                message="Scenario 'Reveil matin' execute", scenario_id=scenarios[0].id),
            Log(level="WARNING", category="system", source="zigbee_plugin",
                message="Capteur Chambre - batterie faible (15%)", device_id=devices[12].id,
                details={"battery": 15, "threshold": 20}),
            Log(level="INFO", category="scenario", source="scenario_engine",
                message="Scenario 'Eclairage auto Entree' execute", scenario_id=scenarios[3].id),
            Log(level="ERROR", category="system", source="mqtt_plugin",
                message="Connexion MQTT perdue - tentative de reconnexion",
                details={"broker": "localhost", "port": 1883, "error": "Connection refused"}),
            Log(level="INFO", category="system", source="mqtt_plugin",
                message="Connexion MQTT retablie"),
            Log(level="INFO", category="user_action", source="scenarios",
                message="Scenario 'Anti-gel jardin' modifie", user_id=admin.id, scenario_id=scenarios[4].id),
            Log(level="INFO", category="schedule", source="scheduler",
                message="Planification 'Ouverture volets matin' executee"),
            Log(level="WARNING", category="system", source="weather_plugin",
                message="Alerte meteo: vigilance orange pluie-inondation",
                details={"department": "75", "level": "orange", "type": "pluie-inondation"}),
            Log(level="INFO", category="scenario", source="scenario_engine",
                message="Scenario 'Mode Nuit' execute", scenario_id=scenarios[1].id),
            Log(level="DEBUG", category="system", source="websocket",
                message="3 clients WebSocket connectes",
                details={"clients": 3}),
        ]

        db.add_all(logs)
        await db.flush()
        print(f"[OK] Logs: {len(logs)} entrees de log creees")

        # =====================================================================
        # COMMIT
        # =====================================================================
        await db.commit()

    print("")
    print("=" * 60)
    print("  SEED TERMINE - Base de donnees peuplee avec succes !")
    print("=" * 60)
    print("")
    print("  Resume:")
    print("    - 2 utilisateurs   (admin/admin, thomas/thomas)")
    print("    - 7 plugins        (Virtual, MQTT, ZigBee, Meteo, Telegram, Camera, RF24Network)")
    print("    - 8 pieces         (Salon, Cuisine, Chambre, ...)")
    print(f"    - {len(devices)} appareils     (lumieres, capteurs, volets, cameras, ...)")
    print(f"    - {len(scenarios)} scenarios    (Reveil, Mode nuit, Alertes, ...)")
    print(f"    - {len(schedules)} planifications")
    print(f"    - {len(logs)} logs")
    print("")
    print("  Lancez le backend :")
    print("    uvicorn app.main:app --reload --port 8000")
    print("")


if __name__ == "__main__":
    asyncio.run(seed())
