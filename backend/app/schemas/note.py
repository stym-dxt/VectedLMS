from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NoteCreate(BaseModel):
    lesson_id: Optional[int] = None
    title: Optional[str] = None
    content: str

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class NoteResponse(BaseModel):
    id: int
    user_id: int
    lesson_id: Optional[int] = None
    title: Optional[str] = None
    content: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True



