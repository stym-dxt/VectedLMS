from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PaymentCreate(BaseModel):
    course_id: int
    amount: float
    currency: str = "INR"

class PaymentResponse(BaseModel):
    id: int
    user_id: int
    course_id: Optional[int] = None
    amount: float
    currency: str
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class RazorpayOrderResponse(BaseModel):
    order_id: str
    amount: float
    currency: str
    key: str

class PaymentVerification(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str



