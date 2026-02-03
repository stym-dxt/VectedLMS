from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LiveClassCreate(BaseModel):
    course_id: int
    title: str
    description: Optional[str] = None
    scheduled_at: datetime
    duration: Optional[int] = None
    instructor_id: Optional[int] = None

class LiveClassUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    duration: Optional[int] = None
    recording_url: Optional[str] = None
    is_completed: Optional[bool] = None

class LiveClassResponse(BaseModel):
    id: int
    course_id: int
    title: str
    description: Optional[str] = None
    meet_link: str
    scheduled_at: datetime
    duration: Optional[int] = None
    instructor_id: Optional[int] = None
    recording_url: Optional[str] = None
    is_completed: bool
    created_at: datetime

    class Config:
        from_attributes = True



