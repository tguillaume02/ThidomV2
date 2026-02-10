"""
ThiDom Telegram Plugin
Sends notifications via the Telegram Bot API.

Hub config (plugin-level):
    bot_token, chat_id

Device config (per-device):
    telegram_bot_token (override), telegram_chat_id (override)
"""
from typing import Any, Dict, List, Optional
import logging
import httpx
from app.plugins.base_plugin import BasePlugin
from app.plugins.registry import register_plugin
from app.core.config import settings

logger = logging.getLogger(__name__)

_bot_token: str = ""
_chat_id: str = ""


def _get_bot_token(device_config: Optional[Dict] = None) -> str:
    if device_config and device_config.get("telegram_bot_token"):
        return device_config["telegram_bot_token"]
    return _bot_token


def _get_chat_id(device_config: Optional[Dict] = None) -> str:
    if device_config and device_config.get("telegram_chat_id"):
        return device_config["telegram_chat_id"]
    return _chat_id


async def send_telegram_message(message: str, bot_token: str = "", chat_id: str = "") -> bool:
    """Send a message via the Telegram Bot API."""
    token = bot_token or _bot_token
    cid = chat_id or _chat_id
    if not token or not cid:
        logger.warning("Telegram not configured (missing bot_token or chat_id)")
        return False

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {"chat_id": cid, "text": message, "parse_mode": "HTML"}

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                logger.info(f"Telegram message sent: {message[:60]}...")
                return True
            else:
                logger.error(f"Telegram API error {resp.status_code}: {resp.text}")
                return False
    except Exception as exc:
        logger.error(f"Telegram send failed: {exc}")
        return False


@register_plugin
class TelegramPlugin(BasePlugin):
    name = "Telegram"
    slug = "telegram"
    version = "1.0.0"
    description = "Notifications via Telegram Bot API"
    category = "info"
    icon = "send"

    def __init__(self):
        super().__init__()

    # ------------------------------------------------------------------
    # Hub config (bot token + chat id)
    # ------------------------------------------------------------------

    @classmethod
    def get_hub_config_schema(cls) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "bot_token": {
                    "type": "string",
                    "title": "Bot Token",
                    "description": "Token du bot Telegram (depuis @BotFather)",
                    "format": "password",
                },
                "chat_id": {
                    "type": "string",
                    "title": "Chat ID",
                    "description": "ID du chat ou groupe pour les notifications",
                },
            },
            "required": ["bot_token", "chat_id"],
        }

    @classmethod
    def get_default_hub_config(cls) -> Dict[str, Any]:
        return {"bot_token": "", "chat_id": ""}

    # ------------------------------------------------------------------
    # Device config (per-device override)
    # ------------------------------------------------------------------

    @classmethod
    def get_config_schema(cls) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "telegram_bot_token": {
                    "type": "string",
                    "title": "Bot Token (override)",
                    "description": "Laisser vide pour utiliser la config du plugin",
                },
                "telegram_chat_id": {
                    "type": "string",
                    "title": "Chat ID (override)",
                },
            },
        }

    @classmethod
    def get_default_config(cls) -> Dict[str, Any]:
        return {"telegram_bot_token": "", "telegram_chat_id": ""}

    @classmethod
    def get_device_types(cls) -> List[str]:
        return ["variable"]

    # ------------------------------------------------------------------
    # Hub lifecycle
    # ------------------------------------------------------------------

    async def setup(self, hub_config: Dict[str, Any]) -> bool:
        global _bot_token, _chat_id
        self._hub_config = hub_config
        _bot_token = hub_config.get("bot_token", "") or getattr(settings, "telegram_bot_token", "") or ""
        _chat_id = hub_config.get("chat_id", "") or getattr(settings, "telegram_chat_id", "") or ""
        if _bot_token and _chat_id:
            self._update_status(True, "Telegram configure")
        else:
            self._update_status(False, "Token ou Chat ID manquant")
        return True

    async def test_connection(self, hub_config: Dict[str, Any]) -> Dict[str, Any]:
        token = hub_config.get("bot_token", "")
        if not token:
            return {"connected": False, "message": "Bot Token manquant"}
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                r = await client.get(f"https://api.telegram.org/bot{token}/getMe")
                if r.status_code == 200:
                    data = r.json()
                    bot_name = data.get("result", {}).get("username", "unknown")
                    chat_id = hub_config.get("chat_id", "")
                    msg = f"Bot @{bot_name} accessible"
                    if chat_id:
                        msg += f", Chat ID: {chat_id}"
                    return {"connected": True, "message": msg}
                return {"connected": False, "message": f"Telegram API: HTTP {r.status_code}"}
        except Exception as exc:
            return {"connected": False, "message": f"Erreur: {exc}"}

    async def initialize(self, config: Dict[str, Any]) -> bool:
        global _bot_token, _chat_id
        _bot_token = getattr(settings, "telegram_bot_token", "") or ""
        _chat_id = getattr(settings, "telegram_chat_id", "") or ""
        return True

    # ------------------------------------------------------------------
    # Device operations
    # ------------------------------------------------------------------

    async def get_state(self, device_config: Dict[str, Any]) -> Dict[str, Any]:
        return {"status": "ready"}

    async def set_state(self, device_config: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        return state

    async def execute_action(self, device_config: Dict[str, Any], action: str, params: Dict[str, Any] = None) -> Any:
        if action == "send_message":
            message = (params or {}).get("message", "")
            token = _get_bot_token(device_config)
            cid = _get_chat_id(device_config)
            await send_telegram_message(message, token, cid)
            return {"status": "sent", "message": message}
        return {"status": "unknown_action"}
