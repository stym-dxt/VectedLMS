from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    role = Column(String, default="prospect")
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    profile_data = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    enrollments = relationship("Enrollment", back_populates="user")
    payments = relationship("Payment", back_populates="user")
    notes = relationship("Note", back_populates="user")
    certifications = relationship("Certification", back_populates="user")
    interview_preps = relationship("InterviewPrep", back_populates="user")
    resumes = relationship("Resume", back_populates="user")
    onboarding_steps = relationship("OnboardingStep", back_populates="user")

