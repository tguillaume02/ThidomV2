from pydantic import BaseModel
from typing import Optional, Any, Dict, List
from datetime import datetime


class LogBase(BaseModel):
    level: str
    category: str
    source: Optional[str] = None
    message: str
    details: Optional[Dict[str, Any]] = None
    user_id: Optional[int] = None
    device_id: Optional[int] = None
    scenario_id: Optional[int] = None


class LogCreate(LogBase):
    pass


class LogResponse(LogBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class LogFilter(BaseModel):
    level: Optional[str] = None
    category: Optional[str] = None
    source: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    limit: int = 100
    offset: int = 0
