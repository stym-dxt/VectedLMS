from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class CourseView(Base):
    __tablename__ = "course_views"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    viewed_at = Column(DateTime(timezone=True), server_default=func.now())

    course = relationship("Course")
    user = relationship("User")

class UserEngagement(Base):
    __tablename__ = "user_engagements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    engagement_type = Column(String, nullable=False)
    engagement_data = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")



