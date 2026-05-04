from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text, inspect
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

engine = create_async_engine(
    settings.database_url,
    echo=settings.debug,
    pool_pre_ping=True,
)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncSession:
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()


async def _add_column_if_missing(conn, table: str, column: str, col_type: str):
    """Add a column to an existing table if it doesn't exist (schema migration)."""
    def _check(sync_conn):
        insp = inspect(sync_conn)
        columns = [c["name"] for c in insp.get_columns(table)]
        return column in columns
    exists = await conn.run_sync(_check)
    if not exists:
        await conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {column} {col_type}"))
        logger.info("Migration: added column %s.%s", table, column)


async def init_db():
    async with engine.begin() as conn:
        from app.models import room, device, plugin, scenario, log, schedule, user
        await conn.run_sync(Base.metadata.create_all)

        # Schema migrations for columns added after initial deployment
        try:
            await _add_column_if_missing(conn, "devices", "auto_off_delay", "INTEGER DEFAULT NULL")
        except Exception as e:
            logger.warning("Migration check failed (may be normal on first run): %s", e)
