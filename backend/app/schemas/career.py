from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class InterviewPrepCreate(BaseModel):
    title: str
    content: Optional[str] = None
    resources: Optional[Dict[str, Any]] = None

class InterviewPrepUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    resources: Optional[Dict[str, Any]] = None

class InterviewPrepResponse(BaseModel):
    id: int
    user_id: int
    title: str
    content: Optional[str] = None
    resources: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ResumeCreate(BaseModel):
    title: str
    resume_data: Dict[str, Any]

class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    resume_data: Optional[Dict[str, Any]] = None

class ResumeResponse(BaseModel):
    id: int
    user_id: int
    title: str
    resume_data: Dict[str, Any]
    resume_file_url: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ClientConnectionCreate(BaseModel):
    client_name: str
    client_email: Optional[str] = None
    client_phone: Optional[str] = None
    notes: Optional[str] = None

class ClientConnectionResponse(BaseModel):
    id: int
    user_id: int
    client_name: str
    client_email: Optional[str] = None
    client_phone: Optional[str] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True



