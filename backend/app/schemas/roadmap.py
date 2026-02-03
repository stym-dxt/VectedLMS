from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class RoadmapCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    course_ids: Optional[List[int]] = None
    order: int = 0

class RoadmapUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    course_ids: Optional[List[int]] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

class RoadmapResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    course_ids: Optional[List[int]] = None
    order: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True



