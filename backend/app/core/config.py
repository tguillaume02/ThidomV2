from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Application
    app_name: str = "ThiDom"
    app_version: str = "1.0.0"
    debug: bool = True

    # Database (supports sqlite, mysql, postgresql)
    # SQLite:      sqlite+aiosqlite:///./thidomv2.db
    # MySQL:       mysql+aiomysql://user:password@localhost:3306/thidomv2
    # PostgreSQL:  postgresql+asyncpg://user:password@localhost:5432/thidomv2
    database_url: str = "sqlite+aiosqlite:///./thidomv2.db"

    # JWT
    secret_key: str = "thidom-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440

    # InfluxDB
    influxdb_url: str = "http://localhost:8086"
    influxdb_token: str = "thidom-influx-token"
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
