from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Integer as IntCol
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, nullable=False)
    user_email = Column(String, nullable=True)
    content = Column(Text, nullable=False)
    rating = Column(IntCol, nullable=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    is_approved = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    course = relationship("Course", back_populates="testimonials")



