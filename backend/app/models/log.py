from sqlalchemy import Column, Integer, String, DateTime, JSON, func
from app.core.database import Base


class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    level = Column(String(20), nullable=False, index=True)  # INFO, WARNING, ERROR, DEBUG
    category = Column(String(50), nullable=False, index=True)  # user_action, system, scenario, error
    source = Column(String(100), nullable=True)  # Module/plugin that generated the log
    message = Column(String(1000), nullable=False)
    details = Column(JSON, nullable=True)
    user_id = Column(Integer, nullable=True)
    device_id = Column(Integer, nullable=True)
    scenario_id = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
