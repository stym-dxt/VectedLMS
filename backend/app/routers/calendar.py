"""
Google Calendar sync endpoint. Run on a schedule (e.g. cron every 15 min) or manually.
Requires admin auth when called via API.
"""
import logging
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models.user import User
from app.services.calendar_sync import sync_calendar_to_live_classes

logger = logging.getLogger(__name__)

router = APIRouter()


class CalendarSyncResponse(BaseModel):
    created: int
    updated: int
    message: str


@router.post("/sync", response_model=CalendarSyncResponse)
async def sync_calendar(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """
    Sync Google Calendar events to LiveClass table.
    Uses GOOGLE_CALENDAR_ID and GOOGLE_APPLICATION_CREDENTIALS.
    Call this periodically (e.g. every 15 min) or after updating the calendar.
    """
    try:
        created, updated = sync_calendar_to_live_classes(db)
        return CalendarSyncResponse(
            created=created,
            updated=updated,
            message=f"Synced: {created} created, {updated} updated.",
        )
    except ValueError as e:
        logger.warning("Calendar sync skipped: %s", e)
        return CalendarSyncResponse(created=0, updated=0, message=str(e))
    except Exception as e:
        logger.exception("Calendar sync failed: %s", e)
        raise
