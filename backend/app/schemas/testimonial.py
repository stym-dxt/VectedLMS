from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TestimonialCreate(BaseModel):
    user_name: str
    user_email: Optional[str] = None
    content: str
    rating: Optional[int] = None
    course_id: Optional[int] = None

class TestimonialUpdate(BaseModel):
    user_name: Optional[str] = None
    content: Optional[str] = None
    rating: Optional[int] = None
    is_approved: Optional[int] = None

class TestimonialResponse(BaseModel):
    id: int
    user_name: str
    user_email: Optional[str] = None
    content: str
    rating: Optional[int] = None
    course_id: Optional[int] = None
    is_approved: int
    created_at: datetime

    class Config:
        from_attributes = True



