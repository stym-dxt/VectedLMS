from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
import bcrypt
import logging
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
logger = logging.getLogger(__name__)

def _truncate_to_72_bytes(password: str) -> bytes:
    """Truncate password to exactly 72 bytes max as UTF-8, ensuring valid UTF-8 encoding."""
    password_bytes = password.encode('utf-8')
    if len(password_bytes) <= 72:
        return password_bytes
    
    # Truncate to 72 bytes
    truncated = password_bytes[:72]
    # Remove any incomplete UTF-8 sequence at the end
    # UTF-8 continuation bytes start with 10xxxxxx (0b10000000 = 0x80)
    # Keep removing continuation bytes until we hit a valid start byte or empty
    while truncated and (truncated[-1] & 0xC0) == 0x80:
        truncated = truncated[:-1]
    return truncated

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash, truncating to 72 bytes if needed."""
    # Truncate password to 72 bytes before verification (same as during hashing)
    password_bytes = _truncate_to_72_bytes(plain_password)
    
    # Use bcrypt directly to verify - this is safe as password is already truncated
    try:
        hashed_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hashed_bytes)
    except Exception as e:
        # Log error but don't fallback to passlib (which has the same 72-byte issue)
        logger = logging.getLogger(__name__)
        logger.error(f"Password verification error: {str(e)}")
        return False

def get_password_hash(password: str) -> str:
    """Hash password using bcrypt directly, ensuring it never exceeds 72 bytes."""
    # Truncate password to 72 bytes BEFORE passing to bcrypt
    password_bytes = _truncate_to_72_bytes(password)
    
    # Use bcrypt directly to hash the bytes, then format as passlib-compatible hash
    # Generate salt and hash
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    
    # Return as string (passlib format: $2b$rounds$salt+hash)
    return hashed.decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    # Convert user_id to string (JWT sub claim must be string)
    if "sub" in to_encode and isinstance(to_encode["sub"], int):
        to_encode["sub"] = str(to_encode["sub"])
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        # Convert sub back to int for compatibility
        if "sub" in payload and isinstance(payload["sub"], str):
            payload["sub"] = int(payload["sub"])
        return payload
    except JWTError as e:
        logger.error(f"JWT decode error: {str(e)}")
        return None
    except (ValueError, TypeError) as e:
        logger.error(f"Error converting user_id: {str(e)}")
        return None

