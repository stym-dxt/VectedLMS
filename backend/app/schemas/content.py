from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ContentAccessCheck(BaseModel):
    has_access: bool
    is_locked: bool
    unlock_message: Optional[str] = None



