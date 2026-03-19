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

_holiday_cache: Dict[str, Any] = {}


async def _fetch_school_holiday(location: str = "Paris") -> Optional[Dict[str, str]]:
    """
    Query the official French government API to check if today falls
    within a school holiday period for the given city/location.
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


def _format_iso_time(iso_str: Optional[str]) -> Optional[str]:
    """Convert ISO datetime string to HH:MM local time, or None."""
    if not iso_str:
        return None
    try:
        dt = datetime.fromisoformat(iso_str.replace("Z", "+00:00"))
        # Rough UTC+1 for France (good enough for display)
        from datetime import timedelta
        local = dt + timedelta(hours=1)
        return local.strftime("%H:%M")
    except Exception:
        return None


# --- Location resolver via Meteo France search API ---

_location_cache: Dict[str, Dict[str, Any]] = {}

METEOFRANCE_SEARCH_URL = "https://meteofrance.com/search/all"


async def _resolve_location(city: str) -> Optional[Dict[str, Any]]:
    """Resolve city name to lat/lng/insee/department via Meteo France search API.

    Returns {"lat": float, "lng": float, "insee": str, "department": str, "name": str}
    or None on failure.  Results are cached permanently (city name is stable).
    """
    key = city.strip().lower()
    if key in _location_cache:
        return _location_cache[key]

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(METEOFRANCE_SEARCH_URL, params={"term": city})
            if r.status_code != 200:
                logger.warning("Meteo France search API returned %s for '%s'", r.status_code, city)
                return None

            results = r.json()
            if not isinstance(results, list):
                return None

            # Pick first VILLE_FRANCE with lat/lng
            for item in results:
                if item.get("type") == "VILLE_FRANCE" and item.get("lat"):
                    info = {
                        "lat": float(item["lat"]),
                        "lng": float(item["lng"]),
                        "insee": item.get("insee", ""),
                        "department": item.get("cp", "")[:2] if item.get("cp") else "",
                        "name": item.get("real_name", city),
                    }
                    _location_cache[key] = info
                    logger.info("Resolved '%s' -> %s (lat=%.4f, lng=%.4f, insee=%s)",
                                city, info["name"], info["lat"], info["lng"], info["insee"])
                    return info

            logger.warning("No VILLE_FRANCE result for '%s'", city)
            return None
    except Exception as e:
        logger.warning("Failed to resolve location '%s': %s", city, e)
        return None


@register_plugin
class WeatherPlugin(BasePlugin):
    name = "Weather"
    slug = "weather"
    version = "1.3.0"
    description = "Meteo via OpenWeatherMap & Meteo France (alertes vigilance, lever/coucher soleil, saison, vacances)"
    category = "info"
    icon = "cloud"
    needs_polling = True

    METEOFRANCE_TOKEN = "token=__Wj7dVSTjV9YGu1guveLyDq0g7S7TfTjaHBTPTpO0kj8__"
    METEOFRANCE_BASE_URL = "https://rpcache-aa.meteofrance.com/internet2018client/2.0/"
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
                    "title": "Fournisseur meteo",
                    "enum": ["openweathermap", "meteofrance"],
                    "default": "meteofrance"
                },
                "api_key": {
                    "type": "string",
                    "title": "Cle API (OpenWeatherMap)",
                    "description": "Cle API OpenWeatherMap (requis si provider=openweathermap)"
                },
                "city": {
                    "type": "string",
                    "title": "Ville",
                    "description": "Nom de la ville (ex: Paris, Lyon, Strasbourg)"
                },
                "insee_code": {
                    "type": "string",
                    "title": "Code INSEE (optionnel)",
                    "description": "Code INSEE de la commune (resolu automatiquement si vide)"
                },
                "department": {
                    "type": "string",
                    "title": "Departement (optionnel)",
                    "description": "Numero du departement pour les alertes vigilance (resolu automatiquement si vide)"
                },
                "units": {
                    "type": "string",
                    "title": "Unites",
                    "enum": ["metric", "imperial"],
                    "default": "metric"
                },
                "refresh_interval": {
                    "type": "integer",
                    "title": "Intervalle de rafraichissement (secondes)",
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
            "insee_code": "",
            "department": "",
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

    async def _get_location(self, device_config: Dict[str, Any]) -> Dict[str, Any]:
        """Resolve and return location info (lat, lng, insee, department).

        Priority:
        1. If lat/lng/insee are explicitly set in config, use them (backward compat).
        2. Otherwise resolve from city name via Meteo France search API.
        3. Fallback to Paris defaults.
        """
        # Backward compatibility: explicit lat/lng in config
        if device_config.get("latitude") and device_config.get("longitude"):
            return {
                "lat": float(device_config["latitude"]),
                "lng": float(device_config["longitude"]),
                "insee": device_config.get("insee_code", ""),
                "department": device_config.get("department", ""),
                "name": device_config.get("city", "Paris"),
            }

        city = device_config.get("city", "Paris")
        location = await _resolve_location(city)
        if location:
            # Let explicit config override resolved values
            if device_config.get("insee_code"):
                location["insee"] = device_config["insee_code"]
            if device_config.get("department"):
                location["department"] = device_config["department"]
            return location

        # Fallback
        return {
            "lat": 48.8566,
            "lng": 2.3522,
            "insee": device_config.get("insee_code", "751100"),
            "department": device_config.get("department", "75"),
            "name": city,
        }

    async def get_state(self, device_config: Dict[str, Any]) -> Dict[str, Any]:
        provider = device_config.get("provider", "meteofrance")
        try:
            location = await self._get_location(device_config)

            if provider == "openweathermap":
                weather = await self._fetch_openweathermap(device_config, location)
            else:
                weather = await self._fetch_meteofrance(device_config, location)

            # Use department from forecast API metadata if not already set
            department = location.get("department", "")
            if not department and weather.get("french_department"):
                department = weather["french_department"]

            # Vigilance alerts
            show_vigilance = device_config.get("show_vigilance", True)
            if department and show_vigilance:
                vigilance = await self._fetch_vigilance(department)
                weather["vigilance"] = vigilance

            # Calendar info
            lat = location["lat"]
            lon = location["lng"]
            city = location.get("name", device_config.get("city", "Paris"))
            calendar = await _build_calendar_info(lat, lon, city)

            if device_config.get("show_sunrise_sunset", True):
                # Prefer precise API sunrise/sunset if available from forecast
                if not weather.get("sunrise"):
                    weather["sunrise"] = calendar["sunrise"]
                if not weather.get("sunset"):
                    weather["sunset"] = calendar["sunset"]
            if device_config.get("show_season", True):
                weather["season"] = calendar["season"]
            if device_config.get("show_weekend", True):
                weather["is_weekend"] = calendar["is_weekend"]
                weather["day_name"] = calendar["day_name"]
            if device_config.get("show_school_holidays", True):
                weather["is_school_holiday"] = calendar["is_school_holiday"]
                weather["school_holiday"] = calendar["school_holiday"]

            # Include resolved location info in state
            weather["latitude"] = lat
            weather["longitude"] = lon

            # Timestamp so the refresh service always detects a change
            weather["last_refresh"] = datetime.now().isoformat()

            return weather
        except Exception as e:
            logger.error("WeatherPlugin.get_state error: %s", e, exc_info=True)
            return {"error": str(e)}

    async def _fetch_openweathermap(self, device_config: Dict[str, Any],
                                     location: Dict[str, Any]) -> Dict[str, Any]:
        api_key = device_config.get("api_key", "")
        city = device_config.get("city", "Paris")
        units = device_config.get("units", "metric")

        if not api_key:
            return {"error": "Cle API OpenWeatherMap non configuree"}

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

    async def _fetch_meteofrance(self, device_config: Dict[str, Any],
                                  location: Dict[str, Any]) -> Dict[str, Any]:
        city = location.get("name", device_config.get("city", "Paris"))
        lat = location["lat"]
        lon = location["lng"]

        observation = {}
        forecast_data = {}

        async with httpx.AsyncClient(timeout=15.0) as client:
            # --- 1. Try observation/gridded (real-time data) ---
            try:
                obs_url = f"{self.METEOFRANCE_BASE_URL}observation/gridded?{self.METEOFRANCE_TOKEN}&lat={lat}&lon={lon}"
                logger.debug("MF observation request: %s", obs_url)
                obs_response = await client.get(obs_url)
                logger.debug("MF observation response: status=%d", obs_response.status_code)

                if obs_response.status_code == 200:
                    obs_data = obs_response.json()
                    gridded = obs_data.get("properties", {}).get("gridded", {})
                    if gridded and gridded.get("T") is not None:
                        observation = {
                            "temperature": gridded.get("T"),
                            "wind_speed": gridded.get("wind_speed"),
                            "wind_direction": gridded.get("wind_direction"),
                            "wind_icon": gridded.get("wind_icon"),
                            "weather_desc": gridded.get("weather_description"),
                            "weather_icon": gridded.get("weather_icon"),
                        }
                        logger.info("MF observation OK for '%s': temp=%s, desc=%s",
                                    city, observation["temperature"], observation["weather_desc"])
                else:
                    logger.warning("MF observation failed: status=%d body=%s",
                                   obs_response.status_code, obs_response.text[:200])
            except Exception as e:
                logger.warning("MF observation error: %s", e)

            # --- 2. Always fetch forecast (hourly + daily for extra fields) ---
            try:
                fc_url = f"{self.METEOFRANCE_BASE_URL}forecast?{self.METEOFRANCE_TOKEN}&lat={lat}&lon={lon}"
                logger.debug("MF forecast request: %s", fc_url)
                fc_response = await client.get(fc_url)
                logger.debug("MF forecast response: status=%d", fc_response.status_code)

                if fc_response.status_code == 200:
                    fc_json = fc_response.json()
                    props = fc_json.get("properties", {})

                    hourly = props.get("forecast", [])
                    current = hourly[0] if hourly else {}

                    daily = props.get("daily_forecast", [])
                    today = daily[0] if daily else {}

                    forecast_data = {
                        "city_name": props.get("name", city),
                        "french_department": props.get("french_department"),
                        "altitude": props.get("altitude"),
                        # Hourly
                        "temperature": current.get("T"),
                        "feels_like": current.get("T_windchill"),
                        "humidity": current.get("relative_humidity"),
                        "pressure": current.get("P_sea"),
                        "wind_speed": current.get("wind_speed"),
                        "wind_speed_gust": current.get("wind_speed_gust"),
                        "wind_direction": current.get("wind_direction"),
                        "wind_icon": current.get("wind_icon"),
                        "weather_desc": current.get("weather_description"),
                        "weather_icon": current.get("weather_icon"),
                        "rain_1h": current.get("rain_1h"),
                        "cloud_cover": current.get("total_cloud_cover"),
                        # Daily
                        "temperature_min": today.get("T_min"),
                        "temperature_max": today.get("T_max"),
                        "precipitation_24h": today.get("total_precipitation_24h"),
                        "uv_index": today.get("uv_index"),
                        "daily_weather_desc": today.get("daily_weather_description"),
                        "daily_weather_icon": today.get("daily_weather_icon"),
                        "sunrise": _format_iso_time(today.get("sunrise_time")),
                        "sunset": _format_iso_time(today.get("sunset_time")),
                    }
                    logger.info("MF forecast OK for '%s': temp=%s, humidity=%s",
                                city, forecast_data["temperature"], forecast_data["humidity"])
                else:
                    logger.warning("MF forecast failed: status=%d body=%s",
                                   fc_response.status_code, fc_response.text[:200])
            except Exception as e:
                logger.warning("MF forecast error: %s", e)

        # --- 3. Merge: observation (real-time) wins, forecast fills gaps ---
        if not observation and not forecast_data:
            logger.error("MF all endpoints failed for '%s' (lat=%.4f, lon=%.4f)", city, lat, lon)
            return {
                "provider": "meteofrance",
                "city": city,
                "error": "Impossible de recuperer les donnees Meteo France",
            }

        result: Dict[str, Any] = {"provider": "meteofrance", "city": city}

        # Start with forecast as base (has humidity, pressure, daily data, etc.)
        for key, val in forecast_data.items():
            if key not in ("city_name",) and val is not None:
                result[key] = val

        # Override with observation (more up-to-date for temp, wind, desc)
        for key, val in observation.items():
            if val is not None:
                result[key] = val

        return result

    async def _fetch_vigilance(self, department: str) -> Dict[str, Any]:
        result: Dict[str, Any] = {
            "department": department,
            "level": 1,
            "color": "vert",
            "alerts": [],
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
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
        return await self.get_state(device_config)

    async def execute_action(self, device_config: Dict[str, Any], action: str, params: Dict[str, Any] = None) -> Any:
        if action == "refresh":
            return await self.get_state(device_config)
        elif action == "get_vigilance":
            location = await self._get_location(device_config)
            department = location.get("department", "75")
            return await self._fetch_vigilance(department)
        elif action == "get_calendar":
            location = await self._get_location(device_config)
            return await _build_calendar_info(location["lat"], location["lng"],
                                              location.get("name", "Paris"))
        elif action == "resolve_location":
            city = (params or {}).get("city", device_config.get("city", "Paris"))
            return await _resolve_location(city)
        return {}
