from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class OnboardingStepCreate(BaseModel):
    step_name: str
    step_data: Optional[Dict[str, Any]] = None

class OnboardingStepUpdate(BaseModel):
    step_data: Optional[Dict[str, Any]] = None
    is_completed: Optional[bool] = None

class OnboardingStepResponse(BaseModel):
    id: int
    user_id: int
    step_name: str
    step_data: Optional[Dict[str, Any]] = None
    is_completed: bool
    completed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True



