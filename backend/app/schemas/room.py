from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class RoomBase(BaseModel):
    name: str
    icon: Optional[str] = "home"
    color: Optional[str] = "#4CAF50"
    parent_id: Optional[int] = None
    order: Optional[int] = 0


class RoomCreate(RoomBase):
    pass


class RoomUpdate(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    parent_id: Optional[int] = None
    order: Optional[int] = None


class RoomResponse(RoomBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class RoomWithDevices(RoomResponse):
    devices: List["DeviceResponse"] = []
    children: List["RoomResponse"] = []


# Forward reference
from app.schemas.device import DeviceResponse
RoomWithDevices.model_rebuild()
