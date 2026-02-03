from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    short_description = Column(String, nullable=True)
    price = Column(Float, default=0.0)
    category = Column(String, nullable=True)
    tags = Column(JSON, nullable=True)
    status = Column(String, default="draft")
    locked_content_config = Column(JSON, nullable=True)
    instructor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    modules = relationship("Module", back_populates="course", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="course")
    testimonials = relationship("Testimonial", back_populates="course")
    live_classes = relationship("LiveClass", back_populates="course")

class Module(Base):
    __tablename__ = "modules"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    order_index = Column(Integer, default=0)
    is_locked = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    course = relationship("Course", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("modules.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    video_url = Column(String, nullable=True)
    duration = Column(Integer, nullable=True)
    order_index = Column(Integer, default=0)
    is_locked = Column(Boolean, default=False)
    is_preview = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    module = relationship("Module", back_populates="lessons")
    notes = relationship("Note", back_populates="lesson")

class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    status = Column(String, default="enrolled")
    progress = Column(Integer, default=0)
    purchased_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")



