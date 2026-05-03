from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.core.database import get_db
from app.core.security import get_current_admin, get_password_hash
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.services.log_service import create_log

router = APIRouter()


@router.get("/", response_model=List[UserResponse])
async def list_users(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).order_by(User.id))
    return result.scalars().all()


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.username == user_data.username))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Username already exists")

    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already exists")

    user = User(
        username=user_data.username,
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=get_password_hash(user_data.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    await create_log(db, "INFO", "admin", f"Admin {admin.username} created user {user.username}", user_id=admin.id)
    return user


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_data.email is not None:
        existing = await db.execute(select(User).where(User.email == user_data.email, User.id != user_id))
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Email already exists")
        user.email = user_data.email

    if user_data.full_name is not None:
        user.full_name = user_data.full_name
    if user_data.password is not None:
        user.hashed_password = get_password_hash(user_data.password)
    if user_data.is_active is not None:
        user.is_active = user_data.is_active
    if user_data.is_admin is not None:
        if user.id == admin.id and not user_data.is_admin:
            raise HTTPException(status_code=400, detail="Cannot remove your own admin privileges")
        user.is_admin = user_data.is_admin

    await db.commit()
    await db.refresh(user)

    await create_log(db, "INFO", "admin", f"Admin {admin.username} updated user {user.username}", user_id=admin.id)
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    username = user.username
    await db.delete(user)
    await db.commit()

    await create_log(db, "WARN", "admin", f"Admin {admin.username} deleted user {username}", user_id=admin.id)
