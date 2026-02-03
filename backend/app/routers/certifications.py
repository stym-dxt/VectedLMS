import secrets
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.models.certification import Certification
from app.models.course import Course, Enrollment
from app.schemas.certification import CertificationResponse, CertificationVerification

router = APIRouter()

def generate_certificate_number(user_id: int, course_id: int) -> str:
    return f"VSA-{user_id:05d}-{course_id:03d}-{secrets.token_hex(4).upper()}"

def generate_verification_code() -> str:
    return secrets.token_urlsafe(16)

@router.get("", response_model=List[CertificationResponse])
async def get_my_certifications(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    certifications = db.query(Certification).filter(
        Certification.user_id == current_user.id
    ).all()
    return certifications

@router.post("/{course_id}/generate", response_model=CertificationResponse, status_code=status.HTTP_201_CREATED)
async def generate_certification(
    course_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == course_id,
        Enrollment.status == "enrolled"
    ).first()
    
    if not enrollment:
        raise HTTPException(status_code=403, detail="Not enrolled in this course")
    
    existing_cert = db.query(Certification).filter(
        Certification.user_id == current_user.id,
        Certification.course_id == course_id
    ).first()
    
    if existing_cert:
        return existing_cert
    
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    new_cert = Certification(
        user_id=current_user.id,
        course_id=course_id,
        certificate_number=generate_certificate_number(current_user.id, course_id),
        verification_code=generate_verification_code()
    )
    db.add(new_cert)
    db.commit()
    db.refresh(new_cert)
    return new_cert

@router.get("/verify/{verification_code}", response_model=CertificationResponse)
async def verify_certification(
    verification_code: str,
    db: Session = Depends(get_db)
):
    cert = db.query(Certification).filter(
        Certification.verification_code == verification_code
    ).first()
    
    if not cert:
        raise HTTPException(status_code=404, detail="Invalid verification code")
    
    return cert



