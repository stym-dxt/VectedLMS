from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class LiveClassAttendee(Base):
    """Calendar/invite attendees per live class. Used so candidates see VSA invites in LMS across domains."""
    __tablename__ = "live_class_attendees"

    id = Column(Integer, primary_key=True, index=True)
    live_class_id = Column(Integer, ForeignKey("live_classes.id", ondelete="CASCADE"), nullable=False)
    email = Column(String, nullable=False, index=True)  # stored lowercase for matching

    live_class = relationship("LiveClass", back_populates="attendees")


class LiveClass(Base):
    __tablename__ = "live_classes"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    meet_link = Column(String, nullable=False)
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    duration = Column(Integer, nullable=True)
    instructor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    recording_url = Column(String, nullable=True)
    is_completed = Column(Boolean, default=False)
    calendar_event_id = Column(String, nullable=True, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    course = relationship("Course", back_populates="live_classes")
    attendees = relationship("LiveClassAttendee", back_populates="live_class", cascade="all, delete-orphan")



