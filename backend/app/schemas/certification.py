from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CertificationResponse(BaseModel):
    id: int
    user_id: int
    course_id: int
    certificate_url: Optional[str] = None
    certificate_number: Optional[str] = None
    issued_at: datetime
    verification_code: Optional[str] = None

    class Config:
        from_attributes = True

class CertificationVerification(BaseModel):
    verification_code: str



