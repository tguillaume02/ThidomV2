"""
Alexa skill handler – self-hosted inside the ThiDom FastAPI backend.

Alexa sends JSON POST requests to  POST /api/alexa/
This module parses the intent, queries the DB directly, and returns
the Alexa JSON response.  No AWS Lambda required.

Additionally:
  GET /api/alexa/slots             → dynamic slot values from DB
  GET /api/alexa/interaction-model  → full Alexa interaction-model JSON
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.websocket import manager
from app.models.device import Device
from app.models.room import Room
from app.models.scenario import Scenario
from app.models.plugin import Plugin
from app.plugins.registry import PluginRegistry
from app.services.scenario_engine import scenario_engine

logger = logging.getLogger(__name__)

router = APIRouter()

# ---------------------------------------------------------------------------
# Alexa response helpers
# ---------------------------------------------------------------------------

def _alexa_response(speech: str, end_session: bool = True) -> dict:
    return {
        "version": "1.0",
        "response": {
            "outputSpeech": {"type": "PlainText", "text": speech},
            "shouldEndSession": end_session,
        },
    }


def _alexa_ask(speech: str) -> dict:
    return {
        "version": "1.0",
        "response": {
            "outputSpeech": {"type": "PlainText", "text": speech},
            "reprompt": {"outputSpeech": {"type": "PlainText", "text": speech}},
            "shouldEndSession": False,
        },
    }


# ---------------------------------------------------------------------------
# DB look-up helpers (async, direct DB access — no HTTP round-trip)
# ---------------------------------------------------------------------------

async def _find_device(name: str, db: AsyncSession) -> Device | None:
    result = await db.execute(select(Device).order_by(Device.name))
    name_lower = name.lower()
    for d in result.scalars().all():
        if name_lower in d.name.lower():
            return d
    return None


async def _find_room(name: str, db: AsyncSession) -> Room | None:
    result = await db.execute(select(Room).order_by(Room.name))
    name_lower = name.lower()
    for r in result.scalars().all():
        if name_lower in r.name.lower():
            return r
    return None


async def _find_scenario(name: str, db: AsyncSession) -> Scenario | None:
    result = await db.execute(select(Scenario).order_by(Scenario.name))
    name_lower = name.lower()
    for s in result.scalars().all():
        if name_lower in s.name.lower():
            return s
    return None


def _describe_state(state: dict) -> str:
    parts = []
    if "power" in state:
        parts.append("allumé" if state["power"] == "on" else "éteint")
    if "temperature" in state:
        parts.append(f"{state['temperature']} degrés")
    if "humidity" in state:
        parts.append(f"{state['humidity']}% d'humidité")
    if "target_temperature" in state:
        parts.append(f"consigne à {state['target_temperature']} degrés")
    if "heating" in state:
        parts.append("en chauffe" if state["heating"] else "arrêté")
    if "brightness" in state:
        parts.append(f"luminosité à {state['brightness']}%")
    return ", ".join(parts) if parts else "état inconnu"


# ---------------------------------------------------------------------------
# Device action helper (reuses plugin logic like the devices route)
# ---------------------------------------------------------------------------

async def _execute_action(device: Device, action: str, db: AsyncSession) -> None:
    plugin_result = await db.execute(select(Plugin).where(Plugin.id == device.plugin_id))
    plugin_model = plugin_result.scalar_one_or_none()

    new_state = None
    if plugin_model:
        instance = await PluginRegistry.get_instance(plugin_model.slug)
        if instance:
            try:
                new_state = await instance.execute_action(device.config or {}, action, {})
            except Exception:
                new_state = None

    if not new_state:
        current_state = dict(device.state or {})
        if action == "turn_on":
            current_state["power"] = "on"
        elif action == "turn_off":
            current_state["power"] = "off"
        elif action == "toggle":
            current_state["power"] = "off" if current_state.get("power") == "on" else "on"
        new_state = current_state

    device.state = {**(device.state or {}), **new_state}
    await db.commit()
    await manager.broadcast_device_state(device.id, device.state)


# ---------------------------------------------------------------------------
# Intent dispatch
# ---------------------------------------------------------------------------

def _slot(body: dict, name: str) -> str | None:
    try:
        return body["request"]["intent"]["slots"][name]["value"]
    except (KeyError, TypeError):
        return None


async def _handle_intent(body: dict, db: AsyncSession) -> dict:
    req_type = body.get("request", {}).get("type", "")

    # -- Launch / session management ----------------------------------------
    if req_type == "LaunchRequest":
        return _alexa_ask(
            "Bienvenue sur maison ThiDom. "
            "Vous pouvez contrôler vos appareils, consulter leur état, "
            "ou lancer un scénario. Que voulez-vous faire ?"
        )

    if req_type == "SessionEndedRequest":
        return _alexa_response("", end_session=True)

    intent_name = body.get("request", {}).get("intent", {}).get("name", "")

    # -- Turn on / off / toggle ---------------------------------------------
    if intent_name in ("TurnOnIntent", "TurnOffIntent", "ToggleIntent"):
        device_name = _slot(body, "device")
        if not device_name:
            return _alexa_response("Je n'ai pas compris le nom de l'appareil.")
        device = await _find_device(device_name, db)
        if not device:
            return _alexa_response(f"Je n'ai pas trouvé l'appareil {device_name}.")

        action_map = {
            "TurnOnIntent": ("turn_on", "allumé"),
            "TurnOffIntent": ("turn_off", "éteint"),
            "ToggleIntent": ("toggle", "basculé"),
        }
        action, verb = action_map[intent_name]
        await _execute_action(device, action, db)
        return _alexa_response(f"J'ai {verb} {device.name}.")

    # -- Set temperature ----------------------------------------------------
    if intent_name == "SetTemperatureIntent":
        device_name = _slot(body, "device")
        temperature = _slot(body, "temperature")
        if not device_name or not temperature:
            return _alexa_response("Précisez l'appareil et la température.")
        device = await _find_device(device_name, db)
        if not device:
            return _alexa_response(f"Je n'ai pas trouvé l'appareil {device_name}.")
        device.state = {**(device.state or {}), "target_temperature": float(temperature)}
        await db.commit()
        await manager.broadcast_device_state(device.id, device.state)
        return _alexa_response(f"J'ai réglé {device.name} sur {temperature} degrés.")

    # -- Get device state ---------------------------------------------------
    if intent_name == "GetDeviceStateIntent":
        device_name = _slot(body, "device")
        if not device_name:
            return _alexa_response("Je n'ai pas compris le nom de l'appareil.")
        device = await _find_device(device_name, db)
        if not device:
            return _alexa_response(f"Je n'ai pas trouvé l'appareil {device_name}.")
        desc = _describe_state(device.state or {})
        return _alexa_response(f"{device.name} est actuellement {desc}.")

    # -- List room devices --------------------------------------------------
    if intent_name == "GetRoomDevicesIntent":
        room_name = _slot(body, "room")
        if not room_name:
            return _alexa_response("Je n'ai pas compris le nom de la pièce.")
        room = await _find_room(room_name, db)
        if not room:
            return _alexa_response(f"Je n'ai pas trouvé la pièce {room_name}.")
        result = await db.execute(
            select(Device).where(Device.room_id == room.id).order_by(Device.name)
        )
        devices = result.scalars().all()
        if not devices:
            return _alexa_response(f"Il n'y a aucun appareil dans {room.name}.")
        names = ", ".join(d.name for d in devices)
        return _alexa_response(f"Dans {room.name}, il y a : {names}.")

    # -- Run scenario -------------------------------------------------------
    if intent_name == "RunScenarioIntent":
        scenario_name = _slot(body, "scenario")
        if not scenario_name:
            return _alexa_response("Je n'ai pas compris le nom du scénario.")
        scenario = await _find_scenario(scenario_name, db)
        if not scenario:
            return _alexa_response(f"Je n'ai pas trouvé le scénario {scenario_name}.")
        actions = scenario.actions or []
        if actions:
            context = await scenario_engine.build_context(db)
            await scenario_engine.execute_actions(actions, db, context)
            scenario.last_triggered = datetime.now(timezone.utc)
            scenario.trigger_count = (scenario.trigger_count or 0) + 1
            await db.commit()
        return _alexa_response(f"J'ai lancé le scénario {scenario.name}.")

    # -- Turn on / off room -------------------------------------------------
    if intent_name in ("TurnOnRoomIntent", "TurnOffRoomIntent"):
        room_name = _slot(body, "room")
        if not room_name:
            return _alexa_response("Je n'ai pas compris le nom de la pièce.")
        room = await _find_room(room_name, db)
        if not room:
            return _alexa_response(f"Je n'ai pas trouvé la pièce {room_name}.")
        result = await db.execute(
            select(Device).where(Device.room_id == room.id)
        )
        devices = result.scalars().all()
        action = "turn_on" if intent_name == "TurnOnRoomIntent" else "turn_off"
        verb = "allumé" if action == "turn_on" else "éteint"
        count = 0
        for d in devices:
            if d.device_type in ("light", "switch"):
                try:
                    await _execute_action(d, action, db)
                    count += 1
                except Exception:
                    pass
        return _alexa_response(
            f"J'ai {verb} {count} appareil{'s' if count > 1 else ''} dans {room.name}."
        )

    # -- Built-in intents ---------------------------------------------------
    if intent_name == "AMAZON.HelpIntent":
        return _alexa_ask(
            "Vous pouvez me demander d'allumer ou éteindre un appareil, "
            "de régler la température d'un thermostat, "
            "de connaître l'état d'un appareil, "
            "de lister les appareils d'une pièce, "
            "ou de lancer un scénario. "
            "Par exemple, dites : allume la lumière du salon."
        )

    if intent_name in ("AMAZON.CancelIntent", "AMAZON.StopIntent"):
        return _alexa_response("Au revoir !")

    if intent_name == "AMAZON.FallbackIntent":
        return _alexa_ask("Je n'ai pas compris. Essayez de dire : allume la lumière du salon.")

    return _alexa_response("Je n'ai pas compris votre demande.")


# ===========================================================================
# ROUTES
# ===========================================================================

@router.post("/")
async def alexa_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """Main Alexa endpoint — receives POST requests from Alexa service."""
    body = await request.json()
    logger.info("Alexa request: type=%s intent=%s",
                body.get("request", {}).get("type"),
                body.get("request", {}).get("intent", {}).get("name"))
    result = await _handle_intent(body, db)
    return JSONResponse(content=result)


# ---------------------------------------------------------------------------
# Dynamic slots & interaction model (unchanged)
# ---------------------------------------------------------------------------

def _slot_value(name: str, synonyms: list[str] | None = None):
    return {"name": {"value": name, "synonyms": synonyms or []}}


@router.get("/slots")
async def get_alexa_slots(db: AsyncSession = Depends(get_db)):
    """Return current devices, rooms and scenarios as Alexa-compatible slot values."""
    devices = (await db.execute(select(Device).order_by(Device.name))).scalars().all()
    rooms = (await db.execute(select(Room).order_by(Room.name))).scalars().all()
    scenarios = (await db.execute(select(Scenario).order_by(Scenario.name))).scalars().all()

    return {
        "DEVICE_NAME": [_slot_value(d.name) for d in devices],
        "ROOM_NAME": [_slot_value(r.name) for r in rooms],
        "SCENARIO_NAME": [_slot_value(s.name) for s in scenarios],
    }


@router.get("/interaction-model")
async def get_alexa_interaction_model(db: AsyncSession = Depends(get_db)):
    """Generate a complete Alexa interaction model JSON with dynamic slot values from DB."""
    devices = (await db.execute(select(Device).order_by(Device.name))).scalars().all()
    rooms = (await db.execute(select(Room).order_by(Room.name))).scalars().all()
    scenarios = (await db.execute(select(Scenario).order_by(Scenario.name))).scalars().all()

    return {
        "interactionModel": {
            "languageModel": {
                "invocationName": "maison thidom",
                "intents": [
                    {
                        "name": "TurnOnIntent",
                        "slots": [{"name": "device", "type": "DEVICE_NAME"}],
                        "samples": [
                            "allume {device}", "allumer {device}", "allume le {device}",
                            "allume la {device}", "allume les {device}", "active {device}",
                            "démarre {device}", "mets en marche {device}", "ouvre {device}",
                        ],
                    },
                    {
                        "name": "TurnOffIntent",
                        "slots": [{"name": "device", "type": "DEVICE_NAME"}],
                        "samples": [
                            "éteins {device}", "éteindre {device}", "éteins le {device}",
                            "éteins la {device}", "éteins les {device}", "désactive {device}",
                            "coupe {device}", "arrête {device}", "ferme {device}",
                        ],
                    },
                    {
                        "name": "ToggleIntent",
                        "slots": [{"name": "device", "type": "DEVICE_NAME"}],
                        "samples": [
                            "bascule {device}", "inverse {device}",
                            "change l'état de {device}", "toggle {device}",
                        ],
                    },
                    {
                        "name": "SetTemperatureIntent",
                        "slots": [
                            {"name": "device", "type": "DEVICE_NAME"},
                            {"name": "temperature", "type": "AMAZON.NUMBER"},
                        ],
                        "samples": [
                            "mets {device} à {temperature} degrés",
                            "règle {device} sur {temperature} degrés",
                            "mets la température de {device} à {temperature}",
                            "règle la température de {device} à {temperature} degrés",
                            "change la température de {device} à {temperature}",
                            "mets le chauffage de {device} à {temperature} degrés",
                        ],
                    },
                    {
                        "name": "GetDeviceStateIntent",
                        "slots": [{"name": "device", "type": "DEVICE_NAME"}],
                        "samples": [
                            "quel est l'état de {device}", "état de {device}",
                            "comment va {device}", "donne moi l'état de {device}",
                            "est-ce que {device} est allumé", "est-ce que {device} est allumée",
                            "quelle est la température de {device}",
                            "donne moi la température de {device}",
                        ],
                    },
                    {
                        "name": "GetRoomDevicesIntent",
                        "slots": [{"name": "room", "type": "ROOM_NAME"}],
                        "samples": [
                            "quels sont les appareils dans {room}",
                            "liste les appareils de {room}",
                            "qu'est-ce qu'il y a dans {room}",
                            "montre moi {room}",
                            "donne moi les appareils de {room}",
                        ],
                    },
                    {
                        "name": "RunScenarioIntent",
                        "slots": [{"name": "scenario", "type": "SCENARIO_NAME"}],
                        "samples": [
                            "lance le scénario {scenario}", "exécute le scénario {scenario}",
                            "déclenche le scénario {scenario}", "active le scénario {scenario}",
                            "lance {scenario}", "exécute {scenario}",
                            "démarre le scénario {scenario}",
                        ],
                    },
                    {
                        "name": "TurnOnRoomIntent",
                        "slots": [{"name": "room", "type": "ROOM_NAME"}],
                        "samples": [
                            "allume tout dans {room}", "allume {room}",
                            "allume la lumière dans {room}", "allume les lumières de {room}",
                            "active tout dans {room}",
                        ],
                    },
                    {
                        "name": "TurnOffRoomIntent",
                        "slots": [{"name": "room", "type": "ROOM_NAME"}],
                        "samples": [
                            "éteins tout dans {room}", "éteins {room}",
                            "éteins la lumière dans {room}", "éteins les lumières de {room}",
                            "coupe tout dans {room}",
                        ],
                    },
                    {"name": "AMAZON.HelpIntent", "samples": []},
                    {"name": "AMAZON.StopIntent", "samples": []},
                    {"name": "AMAZON.CancelIntent", "samples": []},
                    {"name": "AMAZON.FallbackIntent", "samples": []},
                ],
                "types": [
                    {"name": "DEVICE_NAME", "values": [_slot_value(d.name) for d in devices]},
                    {"name": "ROOM_NAME", "values": [_slot_value(r.name) for r in rooms]},
                    {"name": "SCENARIO_NAME", "values": [_slot_value(s.name) for s in scenarios]},
                ],
            },
            "dialog": {
                "intents": [
                    {
                        "name": "SetTemperatureIntent",
                        "confirmationRequired": False,
                        "prompts": {},
                        "slots": [
                            {
                                "name": "device", "type": "DEVICE_NAME",
                                "confirmationRequired": False, "elicitationRequired": True,
                                "prompts": {"elicitation": "Elicit.Slot.device"},
                            },
                            {
                                "name": "temperature", "type": "AMAZON.NUMBER",
                                "confirmationRequired": False, "elicitationRequired": True,
                                "prompts": {"elicitation": "Elicit.Slot.temperature"},
                            },
                        ],
                    }
                ],
                "delegationStrategy": "ALWAYS",
            },
            "prompts": [
                {
                    "id": "Elicit.Slot.device",
                    "variations": [{"type": "PlainText", "value": "Quel appareil voulez-vous régler ?"}],
                },
                {
                    "id": "Elicit.Slot.temperature",
                    "variations": [{"type": "PlainText", "value": "À quelle température souhaitez-vous régler {device} ?"}],
                },
            ],
        }
    }
