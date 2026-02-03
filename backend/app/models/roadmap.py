from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Boolean
from sqlalchemy.sql import func
from app.core.database import Base

class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=True)
    course_ids = Column(JSON, nullable=True)
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

