from typing import Any, Dict, List, Optional
from app.plugins.base_plugin import BasePlugin
from app.plugins.registry import register_plugin
import httpx
import xml.etree.ElementTree as ET
from datetime import datetime, date
import logging
import math

logger = logging.getLogger(__name__)


VIGILANCE_COLORS = {
    "1": "vert",
    "2": "jaune",
    "3": "orange",
    "4": "rouge",
}

VIGILANCE_RISKS = {
    "1": "Vent violent",
    "2": "Pluie-Inondation",
    "3": "Orages",
    "4": "Crues",
    "5": "Neige-Verglas",
    "6": "Canicule",
    "7": "Grand Froid",
    "8": "Avalanches",
    "9": "Vagues-Submersion",
}

# --- School holidays via API (data.education.gouv.fr) with daily cache ---

SCHOOL_HOLIDAYS_API = (
    "https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/"
    "fr-en-calendrier-scolaire/records"
)

# Cache: { "date": "2026-02-10", "location": "Paris", "result": {...} | None }
_holiday_cache: Dict[str, Any] = {}


async def _fetch_school_holiday(location: str = "Paris") -> Optional[Dict[str, str]]:
    """
    Query the official French government API to check if today falls
    within a school holiday period for the given city/location.
    Returns {"name": "Vacances d'Hiver", "start": "2026-02-21", "end": "2026-03-09"}
    or None if no holiday is active.
    Results are cached for the whole day per location.
    """
    today_str = date.today().isoformat()
    cache_key = f"{today_str}:{location}"

    if cache_key in _holiday_cache:
        return _holiday_cache[cache_key]

    try:
        where = (
            f"location='{location}'"
            f" and start_date<='{today_str}'"
            f" and end_date>='{today_str}'"
        )
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                SCHOOL_HOLIDAYS_API,
                params={"limit": 1, "where": where},
            )
            if response.status_code == 200:
                data = response.json()
                results = data.get("results", [])
                if results:
                    record = results[0]
                    holiday_info = {
                        "name": record.get("description", "Vacances"),
                        "start": record.get("start_date", "")[:10],
                        "end": record.get("end_date", "")[:10],
                    }
                    _holiday_cache[cache_key] = holiday_info
                    return holiday_info

            _holiday_cache[cache_key] = None
            return None
    except Exception as e:
        logger.warning(f"Failed to fetch school holidays from API: {e}")
        _holiday_cache[cache_key] = None
        return None


# --- Season / weekend / sunrise helpers ---

def _get_season(d: date) -> str:
    """Return the current season in French."""
    month_day = (d.month, d.day)
    if (3, 20) <= month_day < (6, 21):
        return "Printemps"
    elif (6, 21) <= month_day < (9, 22):
        return "Ete"
    elif (9, 22) <= month_day < (12, 21):
        return "Automne"
    else:
        return "Hiver"


def _is_weekend(d: date) -> bool:
    return d.weekday() >= 5


def _compute_sunrise_sunset(lat: float, lon: float, d: date) -> Dict[str, str]:
    """
    Simple sunrise/sunset approximation using the equation of time.
    For a real product, use the API data instead.
    """
    day_of_year = d.timetuple().tm_yday
    decl = -23.45 * math.cos(math.radians(360 / 365 * (day_of_year + 10)))
    lat_rad = math.radians(lat)
    decl_rad = math.radians(decl)
    cos_ha = -math.tan(lat_rad) * math.tan(decl_rad)
    cos_ha = max(-1, min(1, cos_ha))
    ha = math.degrees(math.acos(cos_ha))
    sunrise_h = 12 - ha / 15
    sunset_h = 12 + ha / 15
    tz_offset = round(lon / 15)
    sunrise_h += tz_offset
    sunset_h += tz_offset

    def fmt(h: float) -> str:
        hh = int(h) % 24
        mm = int((h - int(h)) * 60)
        return f"{hh:02d}:{mm:02d}"

    return {"sunrise": fmt(sunrise_h), "sunset": fmt(sunset_h)}


async def _build_calendar_info(
    lat: float = 48.8566,
    lon: float = 2.3522,
    location: str = "Paris",
) -> Dict[str, Any]:
    """Build calendar / environmental info block."""
    today = date.today()
    now = datetime.now()
    sun = _compute_sunrise_sunset(lat, lon, today)
    holiday = await _fetch_school_holiday(location)
    return {
        "date": today.isoformat(),
        "day_name": now.strftime("%A"),
        "season": _get_season(today),
        "is_weekend": _is_weekend(today),
        "school_holiday": holiday["name"] if holiday else None,
        "is_school_holiday": holiday is not None,
        "sunrise": sun["sunrise"],
        "sunset": sun["sunset"],
    }


@register_plugin
class WeatherPlugin(BasePlugin):
    name = "Weather"
    slug = "weather"
    version = "1.2.0"
    description = "Meteo via OpenWeatherMap & Meteo France (alertes vigilance, lever/coucher soleil, saison, vacances)"
    category = "info"
    icon = "cloud"
    needs_polling = True

    METEOFRANCE_TOKEN = "token=__Wj7dVSTjV9YGu1guveLyDq0g7S7TfTjaHBTPTpO0kj8__"
    METEOFRANCE_BASE_URL = "https://rpcache-aa.meteofrance.com/internet2018client/2.0/"
    METEOFRANCE_SEARCH_URL = "https://meteofrance.com/search/all?term="
    VIGILANCE_URL = "http://vigilance.meteofrance.com/data/NXFR34_LFPW_.xml"
    VIGILANCE_RISK_URL = "http://vigilance.meteofrance.com/data/NXFR33_LFPW_.xml"

    def __init__(self):
        super().__init__()

    @classmethod
    def get_config_schema(cls) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "provider": {
                    "type": "string",
                    "title": "Fournisseur météo",
                    "enum": ["openweathermap", "meteofrance"],
                    "default": "meteofrance"
                },
                "api_key": {
                    "type": "string",
                    "title": "Clé API (OpenWeatherMap)",
                    "description": "Clé API OpenWeatherMap (requis si provider=openweathermap)"
                },
                "city": {
                    "type": "string",
                    "title": "Ville",
                    "description": "Nom de la ville (ex: Paris)"
                },
                "latitude": {
                    "type": "number",
                    "title": "Latitude",
                    "description": "Latitude de la ville (ex: 48.8566)",
                    "default": 48.8566
                },
                "longitude": {
                    "type": "number",
                    "title": "Longitude",
                    "description": "Longitude de la ville (ex: 2.3522)",
                    "default": 2.3522
                },
                "insee_code": {
                    "type": "string",
                    "title": "Code INSEE (Météo France)",
                    "description": "Code INSEE de la commune pour Météo France"
                },
                "department": {
                    "type": "string",
                    "title": "Département (vigilance)",
                    "description": "Numéro du département pour les alertes vigilance (ex: 75)"
                },
                "units": {
                    "type": "string",
                    "title": "Unités",
                    "enum": ["metric", "imperial"],
                    "default": "metric"
                },
                "refresh_interval": {
                    "type": "integer",
                    "title": "Intervalle de rafraîchissement (secondes)",
                    "default": 900
                },
                "show_sunrise_sunset": {
                    "type": "boolean",
                    "title": "Afficher lever/coucher du soleil",
                    "default": True
                },
                "show_vigilance": {
                    "type": "boolean",
                    "title": "Afficher alertes vigilance",
                    "default": True
                },
                "show_season": {
                    "type": "boolean",
                    "title": "Afficher la saison",
                    "default": True
                },
                "show_school_holidays": {
                    "type": "boolean",
                    "title": "Afficher vacances scolaires",
                    "default": True
                },
                "show_weekend": {
                    "type": "boolean",
                    "title": "Afficher si weekend",
                    "default": True
                },
            },
            "required": ["provider", "city"]
        }

    @classmethod
    def get_default_config(cls) -> Dict[str, Any]:
        return {
            "provider": "meteofrance",
            "api_key": "",
            "city": "Paris",
            "latitude": 48.8566,
            "longitude": 2.3522,
            "insee_code": "751550",
            "department": "75",
            "units": "metric",
            "refresh_interval": 900,
            "show_sunrise_sunset": True,
            "show_vigilance": True,
            "show_season": True,
            "show_school_holidays": True,
            "show_weekend": True,
        }

    @classmethod
    def get_device_types(cls) -> List[str]:
        return ["sensor"]

    async def initialize(self, config: Dict[str, Any]) -> bool:
        self._config = config
        return True

    async def get_state(self, device_config: Dict[str, Any]) -> Dict[str, Any]:
        provider = device_config.get("provider", "meteofrance")
        try:
            if provider == "openweathermap":
                weather = await self._fetch_openweathermap(device_config)
            else:
                weather = await self._fetch_meteofrance(device_config)

            # Always try to fetch vigilance alerts if department is set
            department = device_config.get("department")
            show_vigilance = device_config.get("show_vigilance", True)
            if department and show_vigilance:
                vigilance = await self._fetch_vigilance(department)
                weather["vigilance"] = vigilance

            # Calendar info (sunrise/sunset, season, holidays, weekend)
            lat = device_config.get("latitude", 48.8566)
            lon = device_config.get("longitude", 2.3522)
            location = device_config.get("city", "Paris")
            calendar = await _build_calendar_info(lat, lon, location)

            # Apply visibility settings
            if device_config.get("show_sunrise_sunset", True):
                weather["sunrise"] = calendar["sunrise"]
                weather["sunset"] = calendar["sunset"]
            if device_config.get("show_season", True):
                weather["season"] = calendar["season"]
            if device_config.get("show_weekend", True):
                weather["is_weekend"] = calendar["is_weekend"]
                weather["day_name"] = calendar["day_name"]
            if device_config.get("show_school_holidays", True):
                weather["is_school_holiday"] = calendar["is_school_holiday"]
                weather["school_holiday"] = calendar["school_holiday"]

            return weather
        except Exception as e:
            return {"error": str(e)}

    async def _fetch_openweathermap(self, device_config: Dict[str, Any]) -> Dict[str, Any]:
        api_key = device_config.get("api_key", "")
        city = device_config.get("city", "Paris")
        units = device_config.get("units", "metric")

        if not api_key:
            return {"error": "Clé API OpenWeatherMap non configurée"}

        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.openweathermap.org/data/2.5/weather",
                params={"q": city, "appid": api_key, "units": units, "lang": "fr"}
            )
            if response.status_code == 200:
                data = response.json()
                return {
                    "provider": "openweathermap",
                    "temperature": data["main"]["temp"],
                    "feels_like": data["main"].get("feels_like"),
                    "humidity": data["main"]["humidity"],
                    "pressure": data["main"]["pressure"],
                    "description": data["weather"][0]["description"],
                    "icon": data["weather"][0]["icon"],
                    "wind_speed": data["wind"]["speed"],
                    "wind_deg": data["wind"].get("deg", 0),
                    "clouds": data["clouds"]["all"],
                    "city": data["name"],
                }
            return {"error": f"Erreur API OpenWeatherMap: {response.status_code}"}

    async def _fetch_meteofrance(self, device_config: Dict[str, Any]) -> Dict[str, Any]:
        insee_code = device_config.get("insee_code", "751550")
        city = device_config.get("city", "Paris")

        async with httpx.AsyncClient(timeout=15.0) as client:
            # Fetch observation data
            try:
                lat = device_config.get("latitude", 48.8566)
                lon = device_config.get("longitude", 2.3522)
                obs_url = f"{self.METEOFRANCE_BASE_URL}observation/gridded?{self.METEOFRANCE_TOKEN}&lat={lat}&lon={lon}"
                obs_response = await client.get(obs_url)

                if obs_response.status_code == 200:
                    obs_data = obs_response.json()
                    return {
                        "provider": "meteofrance",
                        "city": city,
                        "temperature": obs_data.get("temperature", {}).get("value"),
                        "humidity": obs_data.get("humidity", {}).get("value"),
                        "wind_speed": obs_data.get("wind", {}).get("speed"),
                        "wind_deg": obs_data.get("wind", {}).get("direction"),
                        "weather_desc": obs_data.get("weather", {}).get("desc"),
                        "weather_icon": obs_data.get("weather", {}).get("icon"),
                    }
            except Exception:
                pass

            # Fallback: forecast endpoint
            try:
                forecast_url = f"{self.METEOFRANCE_BASE_URL}forecast?{self.METEOFRANCE_TOKEN}&insee={insee_code}"
                fc_response = await client.get(forecast_url)

                if fc_response.status_code == 200:
                    fc_data = fc_response.json()
                    today = fc_data.get("forecast", [{}])[0] if fc_data.get("forecast") else {}
                    return {
                        "provider": "meteofrance",
                        "city": city,
                        "temperature": today.get("T", {}).get("value"),
                        "temperature_min": today.get("T", {}).get("min"),
                        "temperature_max": today.get("T", {}).get("max"),
                        "humidity": today.get("humidity"),
                        "description": today.get("weather", {}).get("desc"),
                        "icon": today.get("weather", {}).get("icon"),
                    }
            except Exception:
                pass

        return {
            "provider": "meteofrance",
            "city": city,
            "error": "Impossible de récupérer les données Météo France",
        }

    async def _fetch_vigilance(self, department: str) -> Dict[str, Any]:
        """Fetch Météo France vigilance alerts for a given department."""
        result: Dict[str, Any] = {
            "department": department,
            "level": 1,
            "color": "vert",
            "alerts": [],
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            # Main vigilance file – overall level per department
            try:
                response = await client.get(self.VIGILANCE_URL)
                if response.status_code == 200:
                    root = ET.fromstring(response.content)
                    for dv in root.iter("DV"):
                        dep = dv.get("dep", "")
                        if dep == department:
                            level = int(dv.get("coul", "1"))
                            result["level"] = level
                            result["color"] = VIGILANCE_COLORS.get(str(level), "vert")
                            break
            except Exception:
                pass

            # Detailed risk file – individual risk types
            try:
                response = await client.get(self.VIGILANCE_RISK_URL)
                if response.status_code == 200:
                    root = ET.fromstring(response.content)
                    for dv in root.iter("DV"):
                        dep = dv.get("dep", "")
                        if dep == department:
                            for risk in dv.iter("risque"):
                                risk_id = risk.get("val", "")
                                risk_level = int(risk.get("coul", "1"))
                                if risk_level >= 2:
                                    result["alerts"].append({
                                        "risk_id": risk_id,
                                        "risk_name": VIGILANCE_RISKS.get(risk_id, f"Risque {risk_id}"),
                                        "level": risk_level,
                                        "color": VIGILANCE_COLORS.get(str(risk_level), "vert"),
                                    })
                            break
            except Exception:
                pass

        return result

    async def set_state(self, device_config: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        # Weather is read-only – refresh on set
        return await self.get_state(device_config)

    async def execute_action(self, device_config: Dict[str, Any], action: str, params: Dict[str, Any] = None) -> Any:
        if action == "refresh":
            return await self.get_state(device_config)
        elif action == "get_vigilance":
            department = device_config.get("department", params.get("department", "75") if params else "75")
            return await self._fetch_vigilance(department)
        elif action == "get_calendar":
            lat = device_config.get("latitude", 48.8566)
            lon = device_config.get("longitude", 2.3522)
            location = device_config.get("city", "Paris")
            return await _build_calendar_info(lat, lon, location)
        return {}
