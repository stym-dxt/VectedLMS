from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None

class UserCreate(BaseModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    phone: str
    password: Optional[str] = None  # Optional for phone-only signup; backend sets random if missing

    @field_validator("phone")
    @classmethod
    def phone_not_empty(cls, v: str) -> str:
        if not v or len(v.strip().replace(" ", "").replace("+", "")) < 10:
            raise ValueError("Phone number is required (with country code) for OTP login")
        return v.strip().replace(" ", "")

    @field_validator("email")
    @classmethod
    def email_valid_if_provided(cls, v: Optional[str]) -> Optional[str]:
        if v is None or v.strip() == "":
            return None
        import re
        if not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", v.strip()):
            raise ValueError("Invalid email format")
        return v.strip()

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    profile_data: Optional[str] = None

class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class VerifyPhoneRequest(BaseModel):
    id_token: str

class Token(BaseModel):
    access_token: str
    token_type: str

class RegisterResponse(BaseModel):
    user: UserResponse
    access_token: str
    token_type: str = "bearer"

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class TokenData(BaseModel):
    user_id: Optional[int] = None



