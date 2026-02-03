from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.models.course import Lesson, Enrollment
from app.schemas.content import ContentAccessCheck

router = APIRouter()

@router.get("/lesson/{lesson_id}/access", response_model=ContentAccessCheck)
async def check_lesson_access(
    lesson_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    if not lesson.is_locked:
        return ContentAccessCheck(has_access=True, is_locked=False)
    
    if lesson.is_preview:
        return ContentAccessCheck(has_access=True, is_locked=False, unlock_message="This is a preview lesson")
    
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == lesson.module.course_id
    ).first()
    
    if enrollment and enrollment.status == "enrolled":
        return ContentAccessCheck(has_access=True, is_locked=False)
    
    return ContentAccessCheck(
        has_access=False,
        is_locked=True,
        unlock_message="Please enroll in this course to access this content"
    )



