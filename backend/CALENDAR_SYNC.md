# Google Calendar sync

Live class schedule is synced from a Google Calendar into the LMS so students see and join classes from one place.

## Setup

1. **Service account**  
   Use the same JSON key as Firebase (`GOOGLE_APPLICATION_CREDENTIALS`) or create a new one in the same GCP project.

2. **Enable Calendar API**  
   In Google Cloud Console: APIs & Services → Enable APIs → enable **Google Calendar API**.

3. **Share the calendar**  
   In Google Calendar (web): open the calendar → Settings → Share with specific people → add the **service account email** (e.g. `xxx@project-id.iam.gserviceaccount.com`) with **See all event details**.

4. **Calendar ID**  
   In Calendar settings → Integrate calendar → copy **Calendar ID** (e.g. `xxx@group.calendar.google.com`).

5. **Env** (in `.env`):
   - `GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json`
   - `GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com`
   - `GOOGLE_CALENDAR_DEFAULT_COURSE_ID=1` (course to attach synced events to)

## Run sync

- **API (admin only):**  
  `POST /api/calendar/sync` with an admin Bearer token. Returns `{ "created", "updated", "message" }`.

- **Cron (e.g. every 15 min):**
  ```bash
  curl -X POST -H "Authorization: Bearer YOUR_ADMIN_TOKEN" https://your-api/api/calendar/sync
  ```
  Or run a small script that gets an admin token (e.g. login as admin) and calls the endpoint.

## Recordings

After a class, set the recording link in the LMS so it appears under "Recorded":

- **Admin:** `PUT /api/live-classes/{id}` with `{ "recording_url": "https://...", "is_completed": true }`.
- Alternatively, add a separate job or tool that updates `recording_url` from Google Meet/Drive when the recording is ready.

## Migration

Run: `alembic upgrade head` so the `live_classes.calendar_event_id` column exists.
