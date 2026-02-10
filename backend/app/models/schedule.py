from sqlalchemy import Column, Integer, String, Boolean, JSON, DateTime, func
from app.core.database import Base


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(500), nullable=True)
    schedule_type = Column(String(20), nullable=False)  # once, daily, weekly, monthly, cron
    cron_expression = Column(String(100), nullable=True)  # Cron expression for complex schedules
    time = Column(String(5), nullable=True)  # HH:MM format
    days_of_week = Column(JSON, nullable=True)  # [0-6] for weekly schedules
    timezone = Column(String(50), default="Europe/Paris")
    action = Column(JSON, nullable=False)  # Action to perform
    enabled = Column(Boolean, default=True)
    next_run = Column(DateTime(timezone=True), nullable=True)
    last_run = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
