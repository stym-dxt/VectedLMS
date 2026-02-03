from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class LessonBase(BaseModel):
    title: str
    description: Optional[str] = None
    video_url: Optional[str] = None
    duration: Optional[int] = None
    order_index: int = 0
    is_locked: bool = False
    is_preview: bool = False

class LessonCreate(LessonBase):
    module_id: int

class LessonResponse(LessonBase):
    id: int
    module_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ModuleBase(BaseModel):
    title: str
    description: Optional[str] = None
    order_index: int = 0
    is_locked: bool = False

class ModuleCreate(ModuleBase):
    course_id: int

class ModuleResponse(ModuleBase):
    id: int
    course_id: int
    lessons: List[LessonResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True

class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    price: float = 0.0
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    locked_content_config: Optional[Dict[str, Any]] = None

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[str] = None
    locked_content_config: Optional[Dict[str, Any]] = None

class CourseResponse(CourseBase):
    id: int
    status: str
    instructor_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CourseDetailResponse(CourseResponse):
    modules: List[ModuleResponse] = []

class EnrollmentCreate(BaseModel):
    course_id: int

class EnrollmentResponse(BaseModel):
    id: int
    user_id: int
    course_id: int
    status: str
    progress: int
    purchased_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True



