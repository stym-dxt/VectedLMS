import secrets
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.core.config import settings
from app.core.dependencies import get_current_active_user, require_admin
from app.models.user import User
from app.models.live_class import LiveClass
from app.models.course import Course, Enrollment
from app.schemas.live_class import LiveClassCreate, LiveClassUpdate, LiveClassResponse

router = APIRouter()

def generate_meet_link() -> str:
    meeting_code = ''.join(secrets.choice('abcdefghijklmnopqrstuvwxyz') for _ in range(10))
    return f"{settings.GOOGLE_MEET_BASE_URL}/{meeting_code}"

@router.get("", response_model=List[LiveClassResponse])
async def get_live_classes(
    course_id: int = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    query = db.query(LiveClass)
    if course_id:
        query = query.filter(LiveClass.course_id == course_id)
        enrollment = db.query(Enrollment).filter(
            Enrollment.user_id == current_user.id,
            Enrollment.course_id == course_id
        ).first()
        if not enrollment and current_user.role != "admin":
            raise HTTPException(status_code=403, detail="Not enrolled in this course")
    return query.filter(LiveClass.scheduled_at >= datetime.utcnow()).order_by(LiveClass.scheduled_at).all()

@router.get("/{class_id}", response_model=LiveClassResponse)
async def get_live_class(
    class_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    live_class = db.query(LiveClass).filter(LiveClass.id == class_id).first()
    if not live_class:
        raise HTTPException(status_code=404, detail="Live class not found")
    
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == live_class.course_id
    ).first()
    
    if not enrollment and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enrolled in this course")
    
    return live_class

@router.post("", response_model=LiveClassResponse, status_code=status.HTTP_201_CREATED)
async def create_live_class(
    class_data: LiveClassCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == class_data.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    meet_link = generate_meet_link()
    new_class = LiveClass(
        **class_data.dict(),
        meet_link=meet_link,
        instructor_id=class_data.instructor_id or current_user.id
    )
    db.add(new_class)
    db.commit()
    db.refresh(new_class)
    return new_class

@router.put("/{class_id}", response_model=LiveClassResponse)
async def update_live_class(
    class_id: int,
    class_update: LiveClassUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    live_class = db.query(LiveClass).filter(LiveClass.id == class_id).first()
    if not live_class:
        raise HTTPException(status_code=404, detail="Live class not found")
    
    update_data = class_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(live_class, field, value)
    db.commit()
    db.refresh(live_class)
    return live_class



