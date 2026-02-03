from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.schemas.user import UserUpdate, UserResponse

router = APIRouter()

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user



