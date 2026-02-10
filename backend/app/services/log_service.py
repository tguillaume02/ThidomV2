from datetime import datetime
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.log import Log


async def create_log(
    db: AsyncSession,
    level: str,
    category: str,
    message: str,
    source: str = None,
    details: dict = None,
    user_id: int = None,
    device_id: int = None,
    scenario_id: int = None,
):
    log = Log(
        level=level,
        category=category,
        source=source,
        message=message,
        details=details,
        user_id=user_id,
        device_id=device_id,
        scenario_id=scenario_id,
    )
    db.add(log)
    await db.commit()
    return log
