from pydantic import BaseModel
from typing import Optional


class DashboardSummary(BaseModel):
    enrollments_count: int
    total_paid: float
    upcoming_live_classes_count: int
    recorded_classes_count: int
