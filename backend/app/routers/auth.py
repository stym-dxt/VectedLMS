from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import timedelta, datetime, timezone
import hashlib
import secrets
import logging
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings
from app.core.dependencies import get_current_active_user
from app.core.firebase import verify_firebase_id_token
from app.models.user import User
from app.models.password_reset import PasswordResetToken
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token, VerifyPhoneRequest, RegisterResponse, ForgotPasswordRequest, ResetPasswordRequest

logger = logging.getLogger(__name__)
router = APIRouter()

def _digits_only(s: str) -> str:
    return "".join(c for c in (s or "") if c.isdigit())

@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    try:
        logger.info(f"Registration attempt: phone={user_data.phone}, email={user_data.email}")
        if user_data.email:
            existing = db.query(User).filter(User.email == user_data.email).first()
            if existing:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
        phone_digits = _digits_only(user_data.phone)
        users_with_phone = db.query(User).filter(User.phone.isnot(None)).all()
        if any(_digits_only(u.phone) == phone_digits for u in users_with_phone):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Phone number already registered")
        raw_password = (user_data.password or "").strip()
        if not raw_password:
            raw_password = secrets.token_urlsafe(32)
        hashed_password = get_password_hash(raw_password)
        new_user = User(
            email=user_data.email or None,
            password_hash=hashed_password,
            full_name=user_data.full_name,
            phone=user_data.phone,
            role="prospect"
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data={"sub": new_user.id}, expires_delta=access_token_expires)
        logger.info(f"User registered: id={new_user.id}, phone={new_user.phone}")
        return RegisterResponse(user=new_user, access_token=access_token, token_type="bearer")
    except HTTPException:
        # Re-raise HTTP exceptions (400, 401, etc.) as-is
        raise
    except IntegrityError as e:
        db.rollback()
        logger.error(f"Database integrity error during registration: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered or database constraint violation"
        )
    except Exception as e:
        db.rollback()
        error_type = type(e).__name__
        error_message = str(e)
        logger.error(f"Error during registration - Type: {error_type}, Message: {error_message}", exc_info=True)
        logger.error(f"Full error details: {repr(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {error_message}"
        )

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.email == credentials.email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Verify password (this handles password truncation automatically)
        if not verify_password(credentials.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user"
            )
        
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.id}, expires_delta=access_token_expires
        )
        logger.info(f"User logged in successfully: {user.email or user.phone}")
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during login: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.post("/verify-phone", response_model=Token)
async def verify_phone(payload: VerifyPhoneRequest, db: Session = Depends(get_db)):
    """Verify Firebase phone ID token and return our JWT. User must already be registered with this phone."""
    phone = verify_firebase_id_token(payload.id_token)
    if not phone:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired verification code. Please try again."
        )
    # Find user by phone (normalize to digits for comparison)
    def digits_only(s: str) -> str:
        return "".join(c for c in (s or "") if c.isdigit())
    phone_digits = digits_only(phone)
    users_with_phone = db.query(User).filter(User.phone.isnot(None)).all()
    user = next((u for u in users_with_phone if digits_only(u.phone) == phone_digits), None)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This phone number is not registered. Please register first and add your phone number, or sign in with email."
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is inactive"
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    logger.info(f"User logged in via phone: {user.phone}")
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/forgot-password")
async def forgot_password(body: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Request a password reset link. Always returns success to avoid email enumeration."""
    user = db.query(User).filter(User.email == body.email.strip()).first()
    if not user:
        return {"detail": "If this email is registered, you will receive a reset link shortly."}
    raw_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
    expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
    db.add(PasswordResetToken(email=user.email, token_hash=token_hash, expires_at=expires_at))
    db.commit()
    reset_link = f"{getattr(settings, 'FRONTEND_URL', '')}/reset-password?token={raw_token}"
    logger.info(f"Password reset requested for {user.email}. Link: {reset_link}")
    return {"detail": "If this email is registered, you will receive a reset link shortly."}

@router.post("/reset-password")
async def reset_password(body: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Set new password using the token from the reset link."""
    token_hash = hashlib.sha256(body.token.encode()).hexdigest()
    row = db.query(PasswordResetToken).filter(
        PasswordResetToken.token_hash == token_hash,
        PasswordResetToken.expires_at > datetime.now(timezone.utc)
    ).first()
    if not row:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset link.")
    user = db.query(User).filter(User.email == row.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found.")
    if len(body.new_password) < 6:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password must be at least 6 characters.")
    user.password_hash = get_password_hash(body.new_password)
    db.delete(row)
    db.commit()
    logger.info(f"Password reset completed for {user.email}")
    return {"detail": "Password has been reset. You can now sign in."}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    return current_user

