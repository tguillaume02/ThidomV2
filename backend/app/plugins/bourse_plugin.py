from typing import Any, Dict, List
import logging
import httpx

from app.plugins.base_plugin import BasePlugin
from app.plugins.registry import register_plugin

logger = logging.getLogger(__name__)


@register_plugin
class BoursePlugin(BasePlugin):
    name = "Bourse"
    slug = "bourse"
    version = "1.0.0"
    description = "Recupere les cours boursiers (symboles) pour widgets/appareils capteurs"
    category = "info"
    icon = "trending_up"
    needs_polling = True

    @classmethod
    def get_config_schema(cls) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "symbol": {
                    "type": "string",
                    "title": "Symbole boursier",
                    "description": "Ex: AAPL, TSLA, MC.PA, AIR.PA",
                },
                "refresh_interval": {
                    "type": "integer",
                    "title": "Intervalle de rafraichissement (secondes)",
                    "default": 300,
                },
            },
            "required": ["symbol"],
        }

    @classmethod
    def get_default_config(cls) -> Dict[str, Any]:
        return {
            "symbol": "AAPL",
            "refresh_interval": 300,
        }

    @classmethod
    def get_device_types(cls) -> List[str]:
        return ["sensor"]

    async def initialize(self, config: Dict[str, Any]) -> bool:
        self._hub_config = config or {}
        return True

    async def get_state(self, device_config: Dict[str, Any]) -> Dict[str, Any]:
        symbol = str(device_config.get("symbol", "")).strip()
        if not symbol:
            return {
                "power": "off",
                "error": "Symbole non configure",
            }

        url = "https://query1.finance.yahoo.com/v7/finance/quote"
        params = {"symbols": symbol}

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                r = await client.get(url, params=params)

            if r.status_code != 200:
                return {
                    "power": "off",
                    "symbol": symbol,
                    "error": f"Erreur API: {r.status_code}",
                }

            data = r.json()
            results = (data.get("quoteResponse") or {}).get("result") or []
            if not results:
                return {
                    "power": "off",
                    "symbol": symbol,
                    "error": "Symbole introuvable",
                }

            q = results[0]
            price = q.get("regularMarketPrice")
            prev_close = q.get("regularMarketPreviousClose")
            change = q.get("regularMarketChange")
            change_pct = q.get("regularMarketChangePercent")

            return {
                "power": "on",
                "symbol": q.get("symbol", symbol),
                "name": q.get("shortName") or q.get("longName") or symbol,
                "value": price,
                "price": price,
                "currency": q.get("currency"),
                "previous_close": prev_close,
                "change": change,
                "change_percent": change_pct,
                "market_state": q.get("marketState"),
            }
        except Exception as e:
            logger.warning("Bourse get_state failed for %s: %s", symbol, e)
            return {
                "power": "off",
                "symbol": symbol,
                "error": str(e),
            }

    async def set_state(self, device_config: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        # Plugin info/read-only: set_state returns fresh quote
        return await self.get_state(device_config)

    async def execute_action(self, device_config: Dict[str, Any], action: str, params: Dict[str, Any] = None) -> Any:
        if action == "refresh":
            return await self.get_state(device_config)
        return await self.get_state(device_config)
