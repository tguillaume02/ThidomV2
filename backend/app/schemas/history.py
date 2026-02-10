from pydantic import BaseModel
from typing import Optional, Any, Dict, List
from datetime import datetime


class HistoryPoint(BaseModel):
    timestamp: datetime
    value: Any
    field: str


class HistoryQuery(BaseModel):
    device_id: int
    field: Optional[str] = None
    start: Optional[datetime] = None
    end: Optional[datetime] = None
    aggregation: Optional[str] = None  # mean, max, min, sum
    interval: Optional[str] = "1h"  # 1m, 5m, 15m, 1h, 1d


class HistoryResponse(BaseModel):
    device_id: int
    field: str
    points: List[HistoryPoint] = []
