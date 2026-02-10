from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.room import Room
from app.models.user import User
from app.schemas.room import RoomCreate, RoomUpdate, RoomResponse, RoomWithDevices
from app.services.log_service import create_log

router = APIRouter()


@router.get("/", response_model=List[RoomResponse])
async def get_rooms(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Room).order_by(Room.order))
    return result.scalars().all()


@router.get("/tree", response_model=List[RoomWithDevices])
async def get_rooms_tree(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Room)
        .where(Room.parent_id == None)
        .options(selectinload(Room.devices), selectinload(Room.children))
        .order_by(Room.order)
    )
    return result.scalars().all()


@router.get("/{room_id}", response_model=RoomWithDevices)
async def get_room(room_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Room)
        .where(Room.id == room_id)
        .options(selectinload(Room.devices), selectinload(Room.children))
    )
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room


@router.post("/", response_model=RoomResponse)
async def create_room(
    room_data: RoomCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    room = Room(**room_data.model_dump())
    db.add(room)
    await db.commit()
    await db.refresh(room)
    await create_log(db, "INFO", "user_action", f"Room '{room.name}' created", user_id=current_user.id)
    return room


@router.put("/{room_id}", response_model=RoomResponse)
async def update_room(
    room_id: int,
    room_data: RoomUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Room).where(Room.id == room_id))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    for key, value in room_data.model_dump(exclude_unset=True).items():
        setattr(room, key, value)

    await db.commit()
    await db.refresh(room)
    await create_log(db, "INFO", "user_action", f"Room '{room.name}' updated", user_id=current_user.id)
    return room


@router.delete("/{room_id}")
async def delete_room(
    room_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Room).where(Room.id == room_id))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    name = room.name
    await db.delete(room)
    await db.commit()
    await create_log(db, "INFO", "user_action", f"Room '{name}' deleted", user_id=current_user.id)
    return {"message": f"Room '{name}' deleted"}
