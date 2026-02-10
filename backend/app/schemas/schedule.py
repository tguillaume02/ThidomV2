from pydantic import BaseModel
from typing import Optional, Any, Dict, List
from datetime import datetime


class ScheduleBase(BaseModel):
    name: str
    description: Optional[str] = None
    schedule_type: str  # once, daily, weekly, monthly, cron
    cron_expression: Optional[str] = None
    time: Optional[str] = None  # HH:MM
    days_of_week: Optional[List[int]] = None
    timezone: Optional[str] = "Europe/Paris"
    action: Dict[str, Any]
    enabled: Optional[bool] = True


class ScheduleCreate(ScheduleBase):
    pass


class ScheduleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    schedule_type: Optional[str] = None
    cron_expression: Optional[str] = None
    time: Optional[str] = None
    days_of_week: Optional[List[int]] = None
    timezone: Optional[str] = None
    action: Optional[Dict[str, Any]] = None
    enabled: Optional[bool] = None


class ScheduleResponse(ScheduleBase):
    id: int
    next_run: Optional[datetime] = None
    last_run: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
