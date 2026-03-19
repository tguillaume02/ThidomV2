"""
seed_data.py  --  Populate the ThiDom database with real data migrated from
the legacy MariaDB backup (backup_bdd_04_03_2026.sql).

Run:
    cd backend
    python -m seed_data

It uses the same async SQLAlchemy engine as the application.
"""
from __future__ import annotations

import asyncio
import logging

from sqlalchemy import select, text

from app.core.database import engine, async_session, Base
from app.models.room import Room
from app.models.plugin import Plugin
from app.models.device import Device
from app.models.scenario import Scenario
from app.models.schedule import Schedule
from app.models.log import Log
from app.models.user import User

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)-7s %(message)s")
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# bcrypt hash for the default admin password ("admin").
# Generated with: import bcrypt; bcrypt.hashpw(b"admin", bcrypt.gensalt()).decode()
# ---------------------------------------------------------------------------
ADMIN_HASH = "$2b$12$LJ3m4ys3Lk0TSwMCkVc8aOWb1SAJdQ3FzD/rXVKwIiv/bGJDkEKey"


async def seed():
    # Re-create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        # ------------------------------------------------------------------
        # 1. Rooms  (from old "Lieux" table)
        # ------------------------------------------------------------------
        rooms_data = [
            # id, name, icon, color, order
            (1, "Bureau", "computer", "#2196F3", 1),
            (2, "Cuisine", "restaurant", "#FF9800", 2),
            (3, "Chambre", "bed", "#9C27B0", 3),
            (4, "Cave", "basement", "#795548", 4),
            (5, "Salon", "weekend", "#4CAF50", 5),
            (6, "Chambre Alice", "child_care", "#E91E63", 6),
        ]
        for rid, name, icon, color, order in rooms_data:
            existing = await db.get(Room, rid)
            if existing:
                continue
            room = Room(id=rid, name=name, icon=icon, color=color, order=order)
            db.add(room)
        await db.flush()
        logger.info("Rooms seeded")

        # ------------------------------------------------------------------
        # 2. Plugins  (from old "Module_Type" table)
        #
        # Mapping:
        #   1 NRF24      -> rf24network
        #   2 Livebox     -> virtual  (proprietary ISP box, keep as virtual)
        #   3 Bourse      -> virtual  (stock market widget)
        #   4 Domogeek    -> weather
        #   5 Virtuel     -> virtual
        #   6 Telegram    -> telegram
        #   7 Webcam      -> camera
        # ------------------------------------------------------------------
        plugins_data = [
            {
                "id": 1,
                "name": "RF24Network",
                "slug": "rf24network",
                "description": "Appareils sans-fil nRF24L01+ via dongle USB",
                "category": "control",
                "icon": "router",
                "hub_config": {
                    "serial_port": "/dev/ttyUSBArduino",
                    "baud_rate": 115200,
                },
            },
            {
                "id": 2,
                "name": "Virtual",
                "slug": "virtual",
                "description": "Appareils virtuels (tests, logique, widgets divers)",
                "category": "info",
                "icon": "memory",
            },
            {
                "id": 3,
                "name": "Weather",
                "slug": "weather",
                "description": "Meteo (OpenWeatherMap + Meteo France + Domogeek)",
                "category": "info",
                "icon": "wb_sunny",
            },
            {
                "id": 4,
                "name": "Telegram",
                "slug": "telegram",
                "description": "Notifications Telegram",
                "category": "info",
                "icon": "telegram",
                "hub_config": {
                    "bot_token": "612571410:AAGm-1YNStfCeVPJstFLhm-pFDvD8w_ISTM",
                    "chat_id": "-1001459172383",
                },
            },
            {
                "id": 5,
                "name": "Camera",
                "slug": "camera",
                "description": "Cameras IP / Webcam",
                "category": "info",
                "icon": "videocam",
            },
        ]
        for pdata in plugins_data:
            existing = await db.get(Plugin, pdata["id"])
            if existing:
                continue
            plugin = Plugin(
                id=pdata["id"],
                name=pdata["name"],
                slug=pdata["slug"],
                description=pdata["description"],
                category=pdata["category"],
                icon=pdata["icon"],
                enabled=True,
                hub_config=pdata.get("hub_config"),
            )
            db.add(plugin)
        await db.flush()
        logger.info("Plugins seeded")

        # ------------------------------------------------------------------
        # 3. Devices  (from old "Device" + "cmd_device" tables)
        #
        # Old Device table:
        #   1  Bourse     room=1  module=3  CarteId=01
        #   2  Livebox    room=1  module=2  CarteId=01
        #   4  Chaudiere_old  room=4  module=1  GUID=1014191403 CarteId=01
        #   5  Guirlande  room=3  module=1  GUID=1219191931 CarteId=01
        #   6  Chaudiere  room=4  module=1  GUID=118201205 CarteId=02
        #   7  Temperature room=6 module=1  GUID=1025191933 CarteId=01
        #   11 Telegram   room=1  module=6
        #   13 Webcam     room=1  module=7
        #   17 Meteo      room=1  module=4
        #
        # Old cmd_device relevant rows:
        #   1  FDJ (Bourse) -> device 1, info, "25.7"
        #   23 Guirlande    -> device 4(old code=5 in reality), action, widget_id=1
        #   24 Guirlande    -> device 5, action, widget_id=1
        #   30 Thermostat   -> device 6, action, widget_id=5, sensor_attach=32
        #   31 Temperature  -> device 6, info, widget_id=0
        #   32 Temperature  -> device 7, info, widget_id=0, "18.62"
        #   33 temp tension -> device 7, info, widget_id=9, "3.56"
        # ------------------------------------------------------------------

        devices_data = [
            # Bourse (stock widget) -> virtual sensor
            {
                "id": 1,
                "name": "Bourse",
                "device_type": "sensor",
                "icon": "trending_up",
                "room_id": 1,
                "plugin_id": 2,  # virtual
                "config": {"ref": "1rPFDJU", "source": "bourse"},
                "state": {"value": 25.7, "power": "on"},
                "is_visible": True,
                "historize": False,
                "order": 1,
            },
            # Livebox -> virtual sensor
            {
                "id": 2,
                "name": "Livebox",
                "device_type": "sensor",
                "icon": "router",
                "room_id": 1,
                "plugin_id": 2,  # virtual
                "config": {"host": "192.168.1.1", "user": "admin"},
                "state": {"upload": 4.35, "download": 0, "power": "on"},
                "is_visible": False,
                "historize": False,
                "order": 2,
            },
            # Chaudiere_old (old boiler, hidden) -> RF24 relay
            {
                "id": 4,
                "name": "Chaudiere (ancien)",
                "device_type": "switch",
                "icon": "local_fire_department",
                "room_id": 4,
                "plugin_id": 1,  # rf24network
                "config": {
                    "node_id": "01",
                    "device_guid": "1014191403",
                    "widget_id": "1",
                    "pin_id": "0",
                },
                "state": {"power": "off"},
                "is_visible": False,
                "historize": False,
                "order": 1,
            },
            # Guirlande (fairy lights) -> RF24 relay
            {
                "id": 5,
                "name": "Guirlande",
                "device_type": "switch",
                "icon": "lightbulb",
                "room_id": 3,
                "plugin_id": 1,  # rf24network
                "config": {
                    "node_id": "01",
                    "device_guid": "1219191931",
                    "widget_id": "1",
                    "pin_id": "9",
                },
                "state": {"power": "off"},
                "is_visible": True,
                "historize": True,
                "notify_on_state_change": False,
                "order": 1,
            },
            # Chaudiere (current boiler) -> RF24 thermostat
            {
                "id": 6,
                "name": "Chaudiere",
                "device_type": "thermostat",
                "icon": "thermostat",
                "room_id": 4,
                "plugin_id": 1,  # rf24network
                "config": {
                    "node_id": "02",
                    "device_guid": "118201205",
                    "widget_id": "5",
                    "pin_id": "9",
                },
                "state": {
                    "power": "off",
                    "target_temperature": 13,
                    "heating": False,
                    "temperature": 29.12,
                },
                "is_visible": True,
                "historize": True,
                "notify_on_state_change": True,
                "hysteresis": 0.5,
                "linked_sensor_id": 8,  # Temperature sensor device id=8
                "order": 2,
            },
            # Temperature sensor (Chaudiere room) -> RF24 sensor (cmd_device 31)
            {
                "id": 7,
                "name": "Temperature Cave",
                "device_type": "sensor",
                "icon": "thermostat",
                "room_id": 4,
                "plugin_id": 1,  # rf24network
                "config": {
                    "node_id": "02",
                    "device_guid": "118201205",
                    "widget_id": "0",
                    "pin_id": "0",
                },
                "state": {"temperature": 29.12, "power": "on"},
                "is_visible": True,
                "historize": False,
                "order": 3,
            },
            # Temperature sensor (Chambre Alice) -> RF24 sensor (cmd_device 32)
            {
                "id": 8,
                "name": "Temperature Chambre Alice",
                "device_type": "sensor",
                "icon": "thermostat",
                "room_id": 6,
                "plugin_id": 1,  # rf24network
                "config": {
                    "node_id": "01",
                    "device_guid": "1025191933",
                    "widget_id": "0",
                    "pin_id": "0",
                },
                "state": {"temperature": 18.62, "power": "on", "voltage": 3.56, "battery": 3.56},
                "is_visible": True,
                "historize": True,
                "order": 1,
            },
            # Telegram -> telegram plugin
            {
                "id": 11,
                "name": "Telegram",
                "device_type": "sensor",
                "icon": "telegram",
                "room_id": 1,
                "plugin_id": 4,  # telegram
                "config": {"chat_id": "-1001459172383"},
                "state": {"power": "on"},
                "is_visible": False,
                "historize": False,
                "order": 3,
            },
            # Webcam -> camera plugin
            {
                "id": 13,
                "name": "Webcam",
                "device_type": "sensor",
                "icon": "videocam",
                "room_id": 1,
                "plugin_id": 5,  # camera
                "config": {"url": "http://192.168.1.100"},
                "state": {"power": "on"},
                "is_visible": True,
                "historize": False,
                "order": 4,
            },
            # Meteo -> weather plugin
            {
                "id": 17,
                "name": "Meteo",
                "device_type": "sensor",
                "icon": "wb_sunny",
                "room_id": 1,
                "plugin_id": 3,  # weather
                "config": {
                    "departement": "02",
                    "city": "AUDIGNY",
                    "insee": "02035",
                    "holidays_zone": "B",
                },
                "state": {"power": "on"},
                "is_visible": True,
                "historize": False,
                "order": 5,
            },
        ]

        for ddata in devices_data:
            existing = await db.get(Device, ddata["id"])
            if existing:
                continue
            device = Device(
                id=ddata["id"],
                name=ddata["name"],
                device_type=ddata["device_type"],
                icon=ddata.get("icon", "devices"),
                room_id=ddata["room_id"],
                plugin_id=ddata["plugin_id"],
                config=ddata.get("config"),
                state=ddata.get("state", {}),
                is_visible=ddata.get("is_visible", True),
                historize=ddata.get("historize", False),
                notify_on_state_change=ddata.get("notify_on_state_change", False),
                hysteresis=ddata.get("hysteresis"),
                linked_sensor_id=ddata.get("linked_sensor_id"),
                order=ddata.get("order", 0),
            )
            db.add(device)
        await db.flush()
        logger.info("Devices seeded")

        # ------------------------------------------------------------------
        # 4. Scenarios  (from old "Scenario_Xml" table)
        # ------------------------------------------------------------------
        scenarios_data = [
            {
                "id": 1,
                "name": "Thermostat auto (temperature > seuil)",
                "description": "Si la temperature (capteur 32) depasse 18 C, regle le thermostat (cmd 30) a 17 C. Migre depuis l'ancien systeme Blockly.",
                "enabled": True,
                "blockly_xml": '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="controls_if" id="V4ekW_)$-4V|RUyX@lAG" x="358" y="24"><value name="IF0"><block type="logic_compare" id="a09=ARwn*n)Nn1/u5oz?"><field name="OP">GT</field><value name="A"><block type="temperaturevariables" id=":%.jiT2PKco`;F0bmi{t"><field name="Temperature">32</field></block></value><value name="B"><block type="math_number" id="0n|D{z.D(o@6zj/hO-PM"><field name="NUM">18</field></block></value></block></value><statement name="DO0"><block type="logic_set" id="Dg!WxpH~i*j2i)Zt?MY_"><value name="A"><block type="switchvariablesAF" id="UmP@K|vbe1=9cAXfFN9q"><field name="Switch">30</field></block></value><value name="B"><block type="math_number" id="([$y:)hnD.e27e?U|t*l"><field name="NUM">17</field></block></value></block></statement></block></xml>',
                "triggers": [
                    {
                        "type": "device_state",
                        "config": {
                            "device_id": 8,
                            "field": "temperature",
                        },
                    },
                ],
                "conditions": [
                    {
                        "type": "device_state",
                        "config": {
                            "device_id": 8,
                            "field": "temperature",
                            "operator": ">",
                            "value": 18,
                        },
                        "operator": "and",
                    },
                ],
                "actions": [
                    {
                        "type": "set_device_state",
                        "config": {
                            "device_id": 6,
                            "state": {"target_temperature": 17},
                        },
                    },
                ],
            },
        ]
        for sdata in scenarios_data:
            existing = await db.get(Scenario, sdata["id"])
            if existing:
                continue
            scenario = Scenario(
                id=sdata["id"],
                name=sdata["name"],
                description=sdata.get("description"),
                enabled=sdata.get("enabled", True),
                blockly_xml=sdata.get("blockly_xml"),
                triggers=sdata.get("triggers"),
                conditions=sdata.get("conditions"),
                actions=sdata.get("actions"),
            )
            db.add(scenario)
        await db.flush()
        logger.info("Scenarios seeded")

        # ------------------------------------------------------------------
        # 5. Schedules  (from old "Planning" table)
        #
        # Old Planning rows:
        #   13: CmdDevice_Id=30, Days=0,1,2,3,4,5,6, Hours=23:00, Status=17.5, Activate=1
        #   16: CmdDevice_Id=30, Days=0,1,2,3,4,5,6, Hours=07:00, Status=17.5, Activate=1
        #
        # CmdDevice 30 is the Thermostat of device 6 (Chaudiere)
        # ------------------------------------------------------------------
        schedules_data = [
            {
                "id": 1,
                "name": "Chaudiere - Nuit (23h)",
                "description": "Regle le thermostat de la chaudiere a 17.5 C tous les jours a 23h",
                "schedule_type": "daily",
                "time": "23:00",
                "days_of_week": [0, 1, 2, 3, 4, 5, 6],
                "timezone": "Europe/Paris",
                "action": {
                    "type": "set_device_state",
                    "device_id": 6,
                    "state": {"target_temperature": 17.5},
                },
                "enabled": True,
            },
            {
                "id": 2,
                "name": "Chaudiere - Matin (7h)",
                "description": "Regle le thermostat de la chaudiere a 17.5 C tous les jours a 7h",
                "schedule_type": "daily",
                "time": "07:00",
                "days_of_week": [0, 1, 2, 3, 4, 5, 6],
                "timezone": "Europe/Paris",
                "action": {
                    "type": "set_device_state",
                    "device_id": 6,
                    "state": {"target_temperature": 17.5},
                },
                "enabled": True,
            },
        ]
        for schdata in schedules_data:
            existing = await db.get(Schedule, schdata["id"])
            if existing:
                continue
            schedule = Schedule(
                id=schdata["id"],
                name=schdata["name"],
                description=schdata.get("description"),
                schedule_type=schdata["schedule_type"],
                time=schdata.get("time"),
                days_of_week=schdata.get("days_of_week"),
                timezone=schdata.get("timezone", "Europe/Paris"),
                action=schdata["action"],
                enabled=schdata.get("enabled", True),
            )
            db.add(schedule)
        await db.flush()
        logger.info("Schedules seeded")

        # ------------------------------------------------------------------
        # 6. Logs  (from old "Log" table -- last 4 entries only)
        # ------------------------------------------------------------------
        logs_data = [
            {
                "id": 1,
                "level": "INFO",
                "category": "system",
                "source": "scheduler",
                "message": "Planning: Cave Chaudiere 01/118201205_5_9@17.5:0",
                "device_id": 6,
            },
            {
                "id": 2,
                "level": "INFO",
                "category": "system",
                "source": "scheduler",
                "message": "Planning: Cave Chaudiere 02/118201205_5_9@17.5:0",
                "device_id": 6,
            },
            {
                "id": 3,
                "level": "INFO",
                "category": "system",
                "source": "scheduler",
                "message": "Planning: Cave Chaudiere 01/118201205_5_9@17.5:0",
                "device_id": 6,
            },
            {
                "id": 4,
                "level": "INFO",
                "category": "system",
                "source": "scheduler",
                "message": "Planning: Cave Chaudiere 01/118201205_5_9@17.5:1",
                "device_id": 6,
            },
        ]
        for ldata in logs_data:
            existing = await db.get(Log, ldata["id"])
            if existing:
                continue
            log = Log(
                id=ldata["id"],
                level=ldata["level"],
                category=ldata["category"],
                source=ldata.get("source"),
                message=ldata["message"],
                device_id=ldata.get("device_id"),
            )
            db.add(log)
        await db.flush()
        logger.info('Logs seeded')

        existing_user = (await db.execute(select(User).where(User.username == 'admin'))).scalar_one_or_none()
        if not existing_user:
            user = User(id=1, username='admin', email='admin@thidom.local', hashed_password=ADMIN_HASH, full_name='Administrateur', is_active=True, is_admin=True)
            db.add(user)
            logger.info('Admin user seeded')
        await db.commit()
        logger.info('Database seeded successfully!')

if __name__ == '__main__':
    asyncio.run(seed())
