from sqlalchemy import Column, Integer, String, Boolean, JSON, ForeignKey, DateTime, Float, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    device_type = Column(String(50), nullable=False)  # light, switch, sensor, thermostat, etc.
    icon = Column(String(50), default="devices")
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    plugin_id = Column(Integer, ForeignKey("plugins.id"), nullable=False)
    linked_sensor_id = Column(Integer, ForeignKey("devices.id"), nullable=True)
    config = Column(JSON, nullable=True)  # Plugin-specific configuration
    state = Column(JSON, default={})  # Current device state
    is_visible = Column(Boolean, default=True)  # Visible on dashboard
    historize = Column(Boolean, default=False)  # Enable history tracking
    notify_on_state_change = Column(Boolean, default=False)  # Send Telegram notification on state change
    hysteresis = Column(Float, nullable=True, default=None)  # Thermostat hysteresis in °C
    auto_off_delay = Column(Integer, nullable=True, default=None)  # Auto turn-off delay in seconds
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    room = relationship("Room", back_populates="devices")
    plugin = relationship("Plugin", back_populates="devices")
    linked_sensor = relationship("Device", remote_side=[id], foreign_keys=[linked_sensor_id])
