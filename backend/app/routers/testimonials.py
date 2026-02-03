from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_active_user, require_admin
from app.models.user import User
from app.models.testimonial import Testimonial
from app.schemas.testimonial import TestimonialCreate, TestimonialUpdate, TestimonialResponse

router = APIRouter()

@router.get("", response_model=List[TestimonialResponse])
async def get_testimonials(
    course_id: int = None,
    approved_only: bool = True,
    db: Session = Depends(get_db)
):
    query = db.query(Testimonial)
    if approved_only:
        query = query.filter(Testimonial.is_approved == 1)
    if course_id:
        query = query.filter(Testimonial.course_id == course_id)
    return query.order_by(Testimonial.created_at.desc()).all()

@router.post("", response_model=TestimonialResponse, status_code=status.HTTP_201_CREATED)
async def create_testimonial(
    testimonial_data: TestimonialCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    new_testimonial = Testimonial(**testimonial_data.dict())
    db.add(new_testimonial)
    db.commit()
    db.refresh(new_testimonial)
    return new_testimonial

@router.put("/{testimonial_id}", response_model=TestimonialResponse)
async def update_testimonial(
    testimonial_id: int,
    testimonial_update: TestimonialUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    update_data = testimonial_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(testimonial, field, value)
    db.commit()
    db.refresh(testimonial)
    return testimonial



