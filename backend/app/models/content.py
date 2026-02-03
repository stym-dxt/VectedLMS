from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class VideoContent(Base):
    __tablename__ = "video_contents"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)
    title = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer, nullable=True)
    duration = Column(Integer, nullable=True)
    thumbnail_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    lesson = relationship("Lesson")



