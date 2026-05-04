from pydantic import BaseModel
from typing import Optional, Any, Dict
from datetime import datetime


class DeviceBase(BaseModel):
    name: str
    device_type: str
    icon: Optional[str] = "devices"
    room_id: int
    plugin_id: int
    linked_sensor_id: Optional[int] = None
    config: Optional[Dict[str, Any]] = None
    is_visible: Optional[bool] = True
    historize: Optional[bool] = False
    notify_on_state_change: Optional[bool] = False
    hysteresis: Optional[float] = None
    auto_off_delay: Optional[int] = None
    order: Optional[int] = 0


class DeviceCreate(DeviceBase):
    pass


class DeviceUpdate(BaseModel):
    name: Optional[str] = None
    device_type: Optional[str] = None
    icon: Optional[str] = None
    room_id: Optional[int] = None
    plugin_id: Optional[int] = None
    linked_sensor_id: Optional[int] = None
    config: Optional[Dict[str, Any]] = None
    state: Optional[Dict[str, Any]] = None
    is_visible: Optional[bool] = None
    historize: Optional[bool] = None
    notify_on_state_change: Optional[bool] = None
    hysteresis: Optional[float] = None
    auto_off_delay: Optional[int] = None
    order: Optional[int] = None


class DeviceResponse(DeviceBase):
    id: int
    state: Optional[Dict[str, Any]] = {}
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class DeviceStateUpdate(BaseModel):
    state: Dict[str, Any]


class DeviceAction(BaseModel):
    action: str
    params: Optional[Dict[str, Any]] = {}
