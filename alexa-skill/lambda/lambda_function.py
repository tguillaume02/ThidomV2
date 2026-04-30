import os
import logging
import requests
from ask_sdk_core.skill_builder import SkillBuilder
from ask_sdk_core.dispatch_components import (
    AbstractRequestHandler,
    AbstractExceptionHandler,
)
from ask_sdk_core.utils import is_request_type, is_intent_name
from ask_sdk_model import Response

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# -- Configuration ----------------------------------------------------------
THIDOM_API_URL = os.environ.get("THIDOM_API_URL", "http://localhost:8000/api")
THIDOM_TOKEN = os.environ.get("THIDOM_TOKEN", "")

HEADERS = {
    "Authorization": f"Bearer {THIDOM_TOKEN}",
    "Content-Type": "application/json",
}


# -- Helpers ----------------------------------------------------------------

def _api_get(path: str):
    """GET request to ThiDom API."""
    r = requests.get(f"{THIDOM_API_URL}{path}", headers=HEADERS, timeout=10)
    r.raise_for_status()
    return r.json()


def _api_put(path: str, payload: dict):
    """PUT request to ThiDom API."""
    r = requests.put(f"{THIDOM_API_URL}{path}", json=payload, headers=HEADERS, timeout=10)
    r.raise_for_status()
    return r.json()


def _api_post(path: str, payload: dict | None = None):
    """POST request to ThiDom API."""
    r = requests.post(f"{THIDOM_API_URL}{path}", json=payload or {}, headers=HEADERS, timeout=10)
    r.raise_for_status()
    return r.json()


def _find_device_by_name(name: str):
    """Find a device by name (case-insensitive partial match)."""
    devices = _api_get("/devices/")
    name_lower = name.lower()
    for d in devices:
        if name_lower in d["name"].lower():
            return d
    return None


def _find_room_by_name(name: str):
    """Find a room by name (case-insensitive partial match)."""
    rooms = _api_get("/rooms/")
    name_lower = name.lower()
    for r in rooms:
        if name_lower in r["name"].lower():
            return r
    return None


def _find_scenario_by_name(name: str):
    """Find a scenario by name (case-insensitive partial match)."""
    scenarios = _api_get("/scenarios/")
    name_lower = name.lower()
    for s in scenarios:
        if name_lower in s["name"].lower():
            return s
    return None


def _describe_state(state: dict, device_type: str) -> str:
    """Build a human-readable French state description."""
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


# -- Intent Handlers --------------------------------------------------------

class LaunchRequestHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return is_request_type("LaunchRequest")(handler_input)

    def handle(self, handler_input):
        speech = (
            "Bienvenue sur ThiDom. "
            "Vous pouvez contrôler vos appareils, consulter leur état, "
            "ou lancer un scénario. Que voulez-vous faire ?"
        )
        return handler_input.response_builder.speak(speech).ask(speech).response


class TurnOnIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return is_intent_name("TurnOnIntent")(handler_input)

    def handle(self, handler_input):
        device_name = handler_input.request_envelope.request.intent.slots["device"].value
        device = _find_device_by_name(device_name)
        if not device:
            return handler_input.response_builder.speak(
                f"Je n'ai pas trouvé l'appareil {device_name}."
            ).response

        _api_post(f"/devices/{device['id']}/action", {"action": "turn_on", "params": {}})
        return handler_input.response_builder.speak(
            f"J'ai allumé {device['name']}."
        ).response


class TurnOffIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return is_intent_name("TurnOffIntent")(handler_input)

    def handle(self, handler_input):
        device_name = handler_input.request_envelope.request.intent.slots["device"].value
        device = _find_device_by_name(device_name)
        if not device:
            return handler_input.response_builder.speak(
                f"Je n'ai pas trouvé l'appareil {device_name}."
            ).response

        _api_post(f"/devices/{device['id']}/action", {"action": "turn_off", "params": {}})
        return handler_input.response_builder.speak(
            f"J'ai éteint {device['name']}."
        ).response


class ToggleIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return is_intent_name("ToggleIntent")(handler_input)

    def handle(self, handler_input):
        device_name = handler_input.request_envelope.request.intent.slots["device"].value
        device = _find_device_by_name(device_name)
        if not device:
            return handler_input.response_builder.speak(
                f"Je n'ai pas trouvé l'appareil {device_name}."
            ).response

        _api_post(f"/devices/{device['id']}/action", {"action": "toggle", "params": {}})
        return handler_input.response_builder.speak(
            f"J'ai basculé {device['name']}."
        ).response


class SetTemperatureIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return is_intent_name("SetTemperatureIntent")(handler_input)

    def handle(self, handler_input):
        slots = handler_input.request_envelope.request.intent.slots
        device_name = slots["device"].value
        temperature = slots["temperature"].value

        device = _find_device_by_name(device_name)
        if not device:
            return handler_input.response_builder.speak(
                f"Je n'ai pas trouvé l'appareil {device_name}."
            ).response

        _api_put(
            f"/devices/{device['id']}/state",
            {"state": {"target_temperature": float(temperature)}},
        )
        return handler_input.response_builder.speak(
            f"J'ai réglé {device['name']} sur {temperature} degrés."
        ).response


class GetDeviceStateIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return is_intent_name("GetDeviceStateIntent")(handler_input)

    def handle(self, handler_input):
        device_name = handler_input.request_envelope.request.intent.slots["device"].value
        device = _find_device_by_name(device_name)
        if not device:
            return handler_input.response_builder.speak(
                f"Je n'ai pas trouvé l'appareil {device_name}."
            ).response

        state = device.get("state", {})
        desc = _describe_state(state, device.get("device_type", ""))
        return handler_input.response_builder.speak(
            f"{device['name']} est actuellement {desc}."
        ).response


class GetRoomDevicesIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return is_intent_name("GetRoomDevicesIntent")(handler_input)

    def handle(self, handler_input):
        room_name = handler_input.request_envelope.request.intent.slots["room"].value
        room = _find_room_by_name(room_name)
        if not room:
            return handler_input.response_builder.speak(
                f"Je n'ai pas trouvé la pièce {room_name}."
            ).response

        devices = _api_get(f"/devices/?room_id={room['id']}")
        if not devices:
            return handler_input.response_builder.speak(
                f"Il n'y a aucun appareil dans {room['name']}."
            ).response

        names = ", ".join(d["name"] for d in devices)
        return handler_input.response_builder.speak(
            f"Dans {room['name']}, il y a : {names}."
        ).response


class RunScenarioIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return is_intent_name("RunScenarioIntent")(handler_input)

    def handle(self, handler_input):
        scenario_name = handler_input.request_envelope.request.intent.slots["scenario"].value
        scenario = _find_scenario_by_name(scenario_name)
        if not scenario:
            return handler_input.response_builder.speak(
                f"Je n'ai pas trouvé le scénario {scenario_name}."
            ).response

        _api_post(f"/scenarios/{scenario['id']}/test")
        return handler_input.response_builder.speak(
            f"J'ai lancé le scénario {scenario['name']}."
        ).response


class TurnOnRoomIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return is_intent_name("TurnOnRoomIntent")(handler_input)

    def handle(self, handler_input):
        room_name = handler_input.request_envelope.request.intent.slots["room"].value
        room = _find_room_by_name(room_name)
        if not room:
            return handler_input.response_builder.speak(
                f"Je n'ai pas trouvé la pièce {room_name}."
            ).response

        devices = _api_get(f"/devices/?room_id={room['id']}")
        count = 0
        for d in devices:
            if d.get("device_type") in ("light", "switch"):
                try:
                    _api_post(f"/devices/{d['id']}/action", {"action": "turn_on", "params": {}})
                    count += 1
                except Exception:
                    pass

        return handler_input.response_builder.speak(
            f"J'ai allumé {count} appareil{'s' if count > 1 else ''} dans {room['name']}."
        ).response


class TurnOffRoomIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return is_intent_name("TurnOffRoomIntent")(handler_input)

    def handle(self, handler_input):
        room_name = handler_input.request_envelope.request.intent.slots["room"].value
        room = _find_room_by_name(room_name)
        if not room:
            return handler_input.response_builder.speak(
                f"Je n'ai pas trouvé la pièce {room_name}."
            ).response

        devices = _api_get(f"/devices/?room_id={room['id']}")
        count = 0
        for d in devices:
            if d.get("device_type") in ("light", "switch"):
                try:
                    _api_post(f"/devices/{d['id']}/action", {"action": "turn_off", "params": {}})
                    count += 1
                except Exception:
                    pass

        return handler_input.response_builder.speak(
            f"J'ai éteint {count} appareil{'s' if count > 1 else ''} dans {room['name']}."
        ).response


# -- Built-in Intents -------------------------------------------------------

class HelpIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return is_intent_name("AMAZON.HelpIntent")(handler_input)

    def handle(self, handler_input):
        speech = (
            "Vous pouvez me demander d'allumer ou éteindre un appareil, "
            "de régler la température d'un thermostat, "
            "de connaître l'état d'un appareil, "
            "de lister les appareils d'une pièce, "
            "ou de lancer un scénario. "
            "Par exemple, dites : allume la lumière du salon."
        )
        return handler_input.response_builder.speak(speech).ask(speech).response


class CancelStopIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return is_intent_name("AMAZON.CancelIntent")(handler_input) or \
               is_intent_name("AMAZON.StopIntent")(handler_input)

    def handle(self, handler_input):
        return handler_input.response_builder.speak("Au revoir !").response


class FallbackIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return is_intent_name("AMAZON.FallbackIntent")(handler_input)

    def handle(self, handler_input):
        speech = "Je n'ai pas compris. Essayez de dire : allume la lumière du salon."
        return handler_input.response_builder.speak(speech).ask(speech).response


class SessionEndedRequestHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return is_request_type("SessionEndedRequest")(handler_input)

    def handle(self, handler_input):
        return handler_input.response_builder.response


# -- Exception Handler ------------------------------------------------------

class CatchAllExceptionHandler(AbstractExceptionHandler):
    def can_handle(self, handler_input, exception):
        return True

    def handle(self, handler_input, exception):
        logger.error(f"Erreur : {exception}", exc_info=True)
        speech = "Désolé, une erreur est survenue avec ThiDom. Réessayez plus tard."
        return handler_input.response_builder.speak(speech).response


# -- Skill Builder ----------------------------------------------------------

sb = SkillBuilder()
sb.add_request_handler(LaunchRequestHandler())
sb.add_request_handler(TurnOnIntentHandler())
sb.add_request_handler(TurnOffIntentHandler())
sb.add_request_handler(ToggleIntentHandler())
sb.add_request_handler(SetTemperatureIntentHandler())
sb.add_request_handler(GetDeviceStateIntentHandler())
sb.add_request_handler(GetRoomDevicesIntentHandler())
sb.add_request_handler(RunScenarioIntentHandler())
sb.add_request_handler(TurnOnRoomIntentHandler())
sb.add_request_handler(TurnOffRoomIntentHandler())
sb.add_request_handler(HelpIntentHandler())
sb.add_request_handler(CancelStopIntentHandler())
sb.add_request_handler(FallbackIntentHandler())
sb.add_request_handler(SessionEndedRequestHandler())
sb.add_exception_handler(CatchAllExceptionHandler())

lambda_handler = sb.lambda_handler()
