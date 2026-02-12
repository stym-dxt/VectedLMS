"""Firebase Admin SDK for verifying phone auth ID tokens."""
import logging
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)
_firebase_app = None


def get_firebase_app():
    global _firebase_app
    if _firebase_app is not None:
        return _firebase_app
    if not settings.GOOGLE_APPLICATION_CREDENTIALS:
        return None
    try:
        import firebase_admin
        from firebase_admin import credentials
        cred = credentials.Certificate(settings.GOOGLE_APPLICATION_CREDENTIALS)
        _firebase_app = firebase_admin.initialize_app(cred)
        return _firebase_app
    except Exception as e:
        logger.warning(f"Firebase init skipped: {e}")
        return None


def verify_firebase_id_token(id_token: str) -> Optional[str]:
    """
    Verify Firebase ID token and return the phone number (E.164) if valid.
    Returns None if verification fails or Firebase is not configured.
    """
    app = get_firebase_app()
    if not app:
        return None
    try:
        from firebase_admin import auth
        decoded = auth.verify_id_token(id_token)
        phone = decoded.get("phone_number")
        return phone
    except Exception as e:
        logger.warning(f"Firebase token verification failed: {e}")
        return None
