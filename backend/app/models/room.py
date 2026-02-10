from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    icon = Column(String(50), default="home")
    color = Column(String(7), default="#4CAF50")
    parent_id = Column(Integer, ForeignKey("rooms.id"), nullable=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    parent = relationship("Room", remote_side=[id], backref="children")
    devices = relationship("Device", back_populates="room", cascade="all, delete-orphan")
