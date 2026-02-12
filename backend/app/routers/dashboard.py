from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone

from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.models.course import Enrollment
from app.models.payment import Payment
from app.models.live_class import LiveClass
from app.schemas.dashboard import DashboardSummary

router = APIRouter()


@router.get("/summary", response_model=DashboardSummary)
async def get_dashboard_summary(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    now = datetime.now(timezone.utc)

    enrollments_count = (
        db.query(func.count(Enrollment.id))
        .filter(Enrollment.user_id == current_user.id)
        .scalar()
        or 0
    )

    total_paid = (
        db.query(func.coalesce(func.sum(Payment.amount), 0))
        .filter(
            Payment.user_id == current_user.id,
            Payment.status == "completed",
        )
        .scalar()
        or 0.0
    )

    enrolled_course_ids = [
        row[0]
        for row in db.query(Enrollment.course_id)
        .filter(Enrollment.user_id == current_user.id)
        .distinct()
        .all()
    ]

    if not enrolled_course_ids:
        return DashboardSummary(
            enrollments_count=0,
            total_paid=0.0,
            upcoming_live_classes_count=0,
            recorded_classes_count=0,
        )

    upcoming_live_classes_count = (
        db.query(func.count(LiveClass.id))
        .filter(
            LiveClass.course_id.in_(enrolled_course_ids),
            LiveClass.scheduled_at >= now,
        )
        .scalar()
        or 0
    )

    recorded_classes_count = (
        db.query(func.count(LiveClass.id))
        .filter(
            LiveClass.course_id.in_(enrolled_course_ids),
            LiveClass.is_completed == True,
            LiveClass.recording_url.isnot(None),
        )
        .scalar()
        or 0
    )

    return DashboardSummary(
        enrollments_count=enrollments_count,
        total_paid=float(total_paid),
        upcoming_live_classes_count=upcoming_live_classes_count,
        recorded_classes_count=recorded_classes_count,
    )
