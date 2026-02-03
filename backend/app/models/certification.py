from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Certification(Base):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    certificate_url = Column(String, nullable=True)
    certificate_number = Column(String, unique=True, nullable=True)
    issued_at = Column(DateTime(timezone=True), server_default=func.now())
    verification_code = Column(String, unique=True, nullable=True)

    user = relationship("User", back_populates="certifications")
    course = relationship("Course")



