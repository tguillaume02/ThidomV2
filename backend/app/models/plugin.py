from sqlalchemy import Column, Integer, String, Boolean, JSON, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Plugin(Base):
    __tablename__ = "plugins"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    slug = Column(String(100), nullable=False, unique=True, index=True)
    description = Column(String(500), nullable=True)
    version = Column(String(20), default="1.0.0")
    category = Column(String(50), nullable=False)  # "control" or "info"
    icon = Column(String(50), default="extension")
    enabled = Column(Boolean, default=True)
    hub_config = Column(JSON, nullable=True)  # Gateway/hub connection settings (broker, USB port, API keys...)
    config_schema = Column(JSON, nullable=True)  # JSON schema for per-device configuration
    default_config = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    devices = relationship("Device", back_populates="plugin")
