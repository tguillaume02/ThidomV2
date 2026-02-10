from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from datetime import datetime
from app.core.database import get_db
from app.models.log import Log
from app.schemas.log import LogResponse

router = APIRouter()


@router.get("/", response_model=List[LogResponse])
async def get_logs(
    level: Optional[str] = None,
    category: Optional[str] = None,
    source: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = Query(default=100, le=1000),
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    query = select(Log)

    if level:
        query = query.where(Log.level == level)
    if category:
        query = query.where(Log.category == category)
    if source:
        query = query.where(Log.source == source)
    if start_date:
        query = query.where(Log.created_at >= start_date)
    if end_date:
        query = query.where(Log.created_at <= end_date)

    query = query.order_by(desc(Log.created_at)).offset(offset).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/categories")
async def get_log_categories(db: AsyncSession = Depends(get_db)):
    return ["user_action", "system", "scenario", "error"]


@router.get("/levels")
async def get_log_levels():
    return ["DEBUG", "INFO", "WARNING", "ERROR"]
