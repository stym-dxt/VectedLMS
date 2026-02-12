from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import timedelta
import logging
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings
from app.core.dependencies import get_current_active_user
from app.core.firebase import verify_firebase_id_token
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token, VerifyPhoneRequest

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    try:
        logger.info(f"Registration attempt for email: {user_data.email}")
        logger.info(f"Registration data received: email={user_data.email}, full_name={user_data.full_name}, phone={user_data.phone}")
        
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            logger.warning(f"Registration failed: Email already exists - {user_data.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        logger.info(f"Hashing password for user: {user_data.email}")
        hashed_password = get_password_hash(user_data.password)
        logger.info(f"Password hashed successfully")
        
        new_user = User(
            email=user_data.email,
            password_hash=hashed_password,
            full_name=user_data.full_name,
            phone=user_data.phone,
            role="prospect"
        )
        logger.info(f"Creating user object: {new_user.email}")
        db.add(new_user)
        logger.info(f"User added to session, committing to database...")
        db.commit()
        logger.info(f"Database commit successful")
        db.refresh(new_user)
        logger.info(f"User registered successfully: {user_data.email}, ID: {new_user.id}")
        return new_user
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
        logger.info(f"User logged in successfully: {user.email}")
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
    logger.info(f"User logged in via phone: {user.email}")
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    return current_user

