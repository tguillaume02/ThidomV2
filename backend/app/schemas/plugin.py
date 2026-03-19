from pydantic import BaseModel
from typing import Optional, Any, Dict, List
from datetime import datetime


class PluginBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    category: str  # "control" or "info"
    icon: Optional[str] = "extension"
    version: Optional[str] = "1.0.0"
    config_schema: Optional[Dict[str, Any]] = None
    default_config: Optional[Dict[str, Any]] = None


class PluginCreate(PluginBase):
    pass


class PluginUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    enabled: Optional[bool] = None
    config_schema: Optional[Dict[str, Any]] = None
    default_config: Optional[Dict[str, Any]] = None


class PluginHubConfigUpdate(BaseModel):
    hub_config: Dict[str, Any]


class PluginResponse(PluginBase):
    id: int
    enabled: bool
    needs_polling: bool = False
    needs_hub_config: bool = False
    hub_config: Optional[Dict[str, Any]] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
