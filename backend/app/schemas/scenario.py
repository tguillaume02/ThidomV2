from pydantic import BaseModel
from typing import Optional, Any, Dict, List
from datetime import datetime


class TriggerDef(BaseModel):
    type: str  # time, device_state, event, cron
    config: Dict[str, Any]


class ConditionDef(BaseModel):
    type: str  # device_state, time_range, value_compare
    config: Dict[str, Any]
    operator: Optional[str] = "and"  # and, or


class ActionDef(BaseModel):
    type: str  # set_device_state, send_notification, delay, call_api
    config: Dict[str, Any]


class ScenarioBase(BaseModel):
    name: str
    description: Optional[str] = None
    enabled: Optional[bool] = True


class ScenarioCreate(ScenarioBase):
    blockly_xml: Optional[str] = None
    triggers: Optional[List[TriggerDef]] = []
    conditions: Optional[List[ConditionDef]] = []
    actions: Optional[List[ActionDef]] = []


class ScenarioUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    enabled: Optional[bool] = None
    blockly_xml: Optional[str] = None
    triggers: Optional[List[TriggerDef]] = None
    conditions: Optional[List[ConditionDef]] = None
    actions: Optional[List[ActionDef]] = None


class ScenarioResponse(ScenarioBase):
    id: int
    blockly_xml: Optional[str] = None
    triggers: Optional[List[Dict[str, Any]]] = []
    conditions: Optional[List[Dict[str, Any]]] = []
    actions: Optional[List[Dict[str, Any]]] = []
    last_triggered: Optional[datetime] = None
    trigger_count: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
