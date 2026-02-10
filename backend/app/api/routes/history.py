from typing import Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Query

router = APIRouter()


@router.get("/")
async def get_history(
    device_id: int = Query(...),
    field: Optional[str] = None,
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    aggregation: Optional[str] = None,
    interval: str = "1h",
):
    """
    Query device history data.
    In production, this queries InfluxDB or similar time-series database.
    For development, returns sample data.
    """
    if not start:
        start = datetime.utcnow() - timedelta(hours=24)
    if not end:
        end = datetime.utcnow()

    # Sample data for development
    sample_points = []
    current = start
    import random
    while current <= end:
        sample_points.append({
            "timestamp": current.isoformat(),
            "value": round(random.uniform(18, 25), 1),
            "field": field or "temperature",
        })
        current += timedelta(hours=1)

    return {
        "device_id": device_id,
        "field": field or "temperature",
        "start": start.isoformat(),
        "end": end.isoformat(),
        "points": sample_points,
    }
