from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models.user import User
from app.models.course import Course, Enrollment
from app.models.payment import Payment
from app.models.analytics import CourseView, UserEngagement
from app.schemas.user import UserResponse

router = APIRouter()

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.get("/stats")
async def get_admin_stats(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    total_users = db.query(func.count(User.id)).scalar()
    total_courses = db.query(func.count(Course.id)).scalar()
    total_enrollments = db.query(func.count(Enrollment.id)).scalar()
    total_payments = db.query(func.count(Payment.id)).scalar()
    total_revenue = db.query(func.sum(Payment.amount)).filter(Payment.status == "completed").scalar() or 0
    
    return {
        "total_users": total_users,
        "total_courses": total_courses,
        "total_enrollments": total_enrollments,
        "total_payments": total_payments,
        "total_revenue": total_revenue
    }

@router.get("/payments")
async def get_all_payments(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    payments = db.query(Payment).offset(skip).limit(limit).all()
    return payments

@router.get("/analytics/course-views")
async def get_course_views_analytics(
    course_id: int = None,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    query = db.query(CourseView)
    if course_id:
        query = query.filter(CourseView.course_id == course_id)
    views = query.all()
    return views



