import secrets
from pydantic_settings import BaseSettings
from typing import Optional


def _generate_secret_key() -> str:
    """Generate a random secret key at startup if none is configured."""
    return secrets.token_hex(32)


class Settings(BaseSettings):
    # Application
    app_name: str = "ThiDom"
    app_version: str = "1.0.0"
    debug: bool = True

    # Database (supports sqlite, mysql, postgresql)
    # SQLite:      sqlite+aiosqlite:///./data/thidom.db
    # MySQL:       mysql+aiomysql://user:password@localhost:3306/thidom
    # PostgreSQL:  postgresql+asyncpg://user:password@localhost:5432/thidom
    database_url: str = "sqlite+aiosqlite:///./data/thidom.db"

    # JWT — SECRET_KEY is auto-generated if not set in .env
    secret_key: str = ""
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440

    # InfluxDB (optional)
    influxdb_url: str = "http://localhost:8086"
    influxdb_token: str = ""
    influxdb_org: str = "thidom"
    influxdb_bucket: str = "thidom_history"

    # MQTT
    mqtt_broker: str = "localhost"
    mqtt_port: int = 1883

    # Telegram
    telegram_bot_token: str = ""
    telegram_chat_id: str = ""

    # Email (SMTP)
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = ""
    smtp_use_tls: bool = True

    # Timezone
    timezone: str = "Europe/Paris"

    class Config:
        env_file = ".env"
        env_prefix = ""


settings = Settings()

# Auto-generate SECRET_KEY if empty or still the old default
if not settings.secret_key or settings.secret_key == "thidom-secret-key-change-in-production":
    import logging
    settings.secret_key = _generate_secret_key()
    logging.getLogger(__name__).warning(
        "SECRET_KEY not set in .env — using auto-generated key. "
        "JWT tokens will be invalidated on each restart. "
        "Set SECRET_KEY in .env for persistence."
    )
