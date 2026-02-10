from typing import Any, Dict, List
from app.plugins.base_plugin import BasePlugin
from app.plugins.registry import register_plugin
import httpx
import logging

logger = logging.getLogger(__name__)


@register_plugin
class CameraPlugin(BasePlugin):
    name = "Camera"
    slug = "camera"
    version = "1.0.0"
    description = "Cameras IP locales - proxy de flux video via le serveur (aucun acces externe)"
    category = "control"
    icon = "videocam"
    needs_polling = True

    def __init__(self):
        super().__init__()

    @classmethod
    def get_config_schema(cls) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "stream_url": {
                    "type": "string",
                    "title": "URL du flux MJPEG",
                    "description": "URL locale de la camera (ex: http://192.168.1.50:8080/video)",
                },
                "snapshot_url": {
                    "type": "string",
                    "title": "URL snapshot JPEG",
                    "description": "URL locale pour une capture (ex: http://192.168.1.50:8080/shot.jpg)",
                },
                "username": {
                    "type": "string",
                    "title": "Utilisateur",
                    "description": "Authentification camera (optionnel)",
                },
                "password": {
                    "type": "string",
                    "title": "Mot de passe",
                    "description": "Mot de passe camera (optionnel)",
                },
                "refresh_interval": {
                    "type": "integer",
                    "title": "Intervalle snapshot (secondes)",
                    "description": "Frequence de rafraichissement du snapshot pour le dashboard",
                    "default": 5,
                },
            },
            "required": ["stream_url"],
        }

    @classmethod
    def get_default_config(cls) -> Dict[str, Any]:
        return {
            "stream_url": "",
            "snapshot_url": "",
            "username": "",
            "password": "",
            "refresh_interval": 5,
        }

    @classmethod
    def get_device_types(cls) -> List[str]:
        return ["camera"]

    async def initialize(self, config: Dict[str, Any]) -> bool:
        self._config = config
        return True

    async def get_state(self, device_config: Dict[str, Any]) -> Dict[str, Any]:
        stream_url = device_config.get("stream_url", "")
        reachable = False
        if stream_url:
            try:
                auth = self._get_auth(device_config)
                async with httpx.AsyncClient(timeout=5.0) as client:
                    r = await client.head(stream_url, auth=auth)
                    reachable = r.status_code < 400
            except Exception:
                pass
        return {
            "power": "on" if reachable else "off",
            "reachable": reachable,
            "recording": False,
        }

    async def set_state(self, device_config: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        current = await self.get_state(device_config)
        current.update(state)
        return current

    async def execute_action(self, device_config: Dict[str, Any], action: str, params: Dict[str, Any] = None) -> Any:
        if action == "refresh":
            return await self.get_state(device_config)
        if action == "snapshot":
            return await self._take_snapshot(device_config)
        return await self.get_state(device_config)

    async def _take_snapshot(self, device_config: Dict[str, Any]) -> Dict[str, Any]:
        snapshot_url = device_config.get("snapshot_url") or device_config.get("stream_url", "")
        if not snapshot_url:
            return {"error": "Aucune URL de snapshot configuree"}
        try:
            auth = self._get_auth(device_config)
            async with httpx.AsyncClient(timeout=10.0) as client:
                r = await client.get(snapshot_url, auth=auth)
                if r.status_code == 200:
                    return {"power": "on", "reachable": True, "snapshot": True}
        except Exception as e:
            logger.warning(f"Camera snapshot failed: {e}")
        return {"power": "off", "reachable": False, "snapshot": False}

    @staticmethod
    def _get_auth(device_config: Dict[str, Any]):
        username = device_config.get("username")
        password = device_config.get("password")
        if username and password:
            return (username, password)
        return None
