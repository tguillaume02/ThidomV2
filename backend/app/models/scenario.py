from sqlalchemy import Column, Integer, String, Boolean, JSON, DateTime, func
from app.core.database import Base


class Scenario(Base):
    __tablename__ = "scenarios"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(500), nullable=True)
    enabled = Column(Boolean, default=True)
    blockly_xml = Column(String, nullable=True)  # Blockly workspace XML
    triggers = Column(JSON, nullable=True)  # List of trigger definitions
    conditions = Column(JSON, nullable=True)  # List of conditions
    actions = Column(JSON, nullable=True)  # List of actions
    last_triggered = Column(DateTime(timezone=True), nullable=True)
    trigger_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
