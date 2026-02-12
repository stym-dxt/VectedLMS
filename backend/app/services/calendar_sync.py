"""
Sync Google Calendar events to LiveClass rows.
Uses GOOGLE_APPLICATION_CREDENTIALS (service account JSON) and GOOGLE_CALENDAR_ID.
Share the calendar with the service account email so it can read events.
"""
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional, Tuple

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.live_class import LiveClass, LiveClassAttendee
from app.models.course import Course

logger = logging.getLogger(__name__)


def _get_calendar_service():
    """Build Google Calendar API service using service account credentials."""
    if not settings.GOOGLE_APPLICATION_CREDENTIALS:
        raise ValueError("GOOGLE_APPLICATION_CREDENTIALS is not set")
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
    except ImportError as e:
        raise ImportError(
            "Install google-api-python-client and google-auth: pip install google-api-python-client google-auth"
        ) from e

    scopes = ["https://www.googleapis.com/auth/calendar.events.readonly"]
    creds = service_account.Credentials.from_service_account_file(
        settings.GOOGLE_APPLICATION_CREDENTIALS, scopes=scopes
    )
    service = build("calendar", "v3", credentials=creds)
    return service


def _meet_link_from_event(event: dict) -> Optional[str]:
    """Extract Google Meet link from calendar event."""
    conference = event.get("conferenceData", {})
    for ep in conference.get("entryPoints", []):
        if ep.get("entryPointType") == "video":
            return ep.get("uri")
    if event.get("hangoutLink"):
        return event["hangoutLink"]
    location = (event.get("location") or "").strip()
    if location and ("meet.google.com" in location or "meet." in location):
        return location
    return None


def _scheduled_at_from_event(event: dict) -> Optional[datetime]:
    """Parse start time; return None for all-day events."""
    start = event.get("start") or {}
    if "dateTime" in start:
        dt_str = start["dateTime"]
        if dt_str.endswith("Z"):
            return datetime.fromisoformat(dt_str.replace("Z", "+00:00"))
        if "+" in dt_str or dt_str.count("-") > 2:
            return datetime.fromisoformat(dt_str)
        return datetime.fromisoformat(dt_str).replace(tzinfo=timezone.utc)
    return None


def _attendee_emails_from_event(event: dict) -> list[str]:
    """Extract attendee emails from calendar event (lowercase for matching)."""
    emails = []
    for att in event.get("attendees") or []:
        email = (att.get("email") or "").strip().lower()
        if email:
            emails.append(email)
    return list(dict.fromkeys(emails))  # preserve order, dedupe


def _duration_minutes_from_event(event: dict) -> Optional[int]:
    """Compute duration in minutes from start/end."""
    start = event.get("start") or {}
    end = event.get("end") or {}
    for key in ("dateTime", "date"):
        if key in start and key in end:
            try:
                s = start[key]
                e = end[key]
                if key == "dateTime":
                    ds = datetime.fromisoformat(s.replace("Z", "+00:00"))
                    de = datetime.fromisoformat(e.replace("Z", "+00:00"))
                else:
                    ds = datetime.fromisoformat(s)
                    de = datetime.fromisoformat(e)
                delta = de - ds
                return int(delta.total_seconds() / 60)
            except Exception:
                pass
    return None


def sync_calendar_to_live_classes(db: Session) -> Tuple[int, int]:
    """
    Fetch events from Google Calendar and upsert LiveClass rows.
    Returns (created_count, updated_count).
    """
    if not settings.GOOGLE_CALENDAR_ID:
        logger.warning("GOOGLE_CALENDAR_ID not set; skipping calendar sync")
        return 0, 0

    course_id = settings.GOOGLE_CALENDAR_DEFAULT_COURSE_ID
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        logger.warning("GOOGLE_CALENDAR_DEFAULT_COURSE_ID=%s course not found; skipping sync", course_id)
        return 0, 0

    service = _get_calendar_service()
    time_min = (datetime.now(timezone.utc) - timedelta(days=30)).isoformat()
    time_max = (datetime.now(timezone.utc) + timedelta(days=180)).isoformat()

    events_result = (
        service.events()
        .list(
            calendarId=settings.GOOGLE_CALENDAR_ID,
            timeMin=time_min,
            timeMax=time_max,
            singleEvents=True,
            orderBy="startTime",
        )
        .execute()
    )
    events = events_result.get("items", [])

    created, updated = 0, 0
    for event in events:
        if event.get("status") == "cancelled":
            existing = db.query(LiveClass).filter(LiveClass.calendar_event_id == event["id"]).first()
            if existing:
                db.delete(existing)
            continue

        event_id = event.get("id")
        scheduled_at = _scheduled_at_from_event(event)
        if not scheduled_at:
            continue

        meet_link = _meet_link_from_event(event)
        if not meet_link:
            meet_link = settings.GOOGLE_MEET_BASE_URL or "https://meet.google.com"

        title = (event.get("summary") or "Live Class").strip() or "Live Class"
        description = (event.get("description") or "").strip() or None
        duration = _duration_minutes_from_event(event)

        existing = db.query(LiveClass).filter(LiveClass.calendar_event_id == event_id).first()
        if existing:
            existing.title = title
            existing.description = description
            existing.meet_link = meet_link
            existing.scheduled_at = scheduled_at
            existing.duration = duration
            existing.course_id = course_id
            updated += 1
            live_class_row = existing
        else:
            live_class_row = LiveClass(
                course_id=course_id,
                title=title,
                description=description,
                meet_link=meet_link,
                scheduled_at=scheduled_at,
                duration=duration,
                calendar_event_id=event_id,
            )
            db.add(live_class_row)
            db.flush()
            created += 1

        # Replace attendees so candidates invited (any domain) see this event in LMS
        db.query(LiveClassAttendee).filter(LiveClassAttendee.live_class_id == live_class_row.id).delete()
        for email in _attendee_emails_from_event(event):
            db.add(LiveClassAttendee(live_class_id=live_class_row.id, email=email))

    db.commit()
    logger.info("Calendar sync: created=%s, updated=%s", created, updated)
    return created, updated
