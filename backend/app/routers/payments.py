import razorpay
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.models.payment import Payment
from app.models.course import Course, Enrollment
from app.schemas.payment import PaymentCreate, PaymentResponse, RazorpayOrderResponse, PaymentVerification

router = APIRouter()

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

@router.post("/create-order", response_model=RazorpayOrderResponse)
async def create_payment_order(
    payment_data: PaymentCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == payment_data.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    amount_in_paise = int(payment_data.amount * 100)
    
    order_data = {
        "amount": amount_in_paise,
        "currency": payment_data.currency,
        "receipt": f"course_{payment_data.course_id}_user_{current_user.id}",
        "notes": {
            "course_id": payment_data.course_id,
            "user_id": current_user.id
        }
    }
    
    razorpay_order = client.order.create(data=order_data)
    
    payment_record = Payment(
        user_id=current_user.id,
        course_id=payment_data.course_id,
        amount=payment_data.amount,
        currency=payment_data.currency,
        razorpay_order_id=razorpay_order["id"],
        status="pending"
    )
    db.add(payment_record)
    db.commit()
    
    return RazorpayOrderResponse(
        order_id=razorpay_order["id"],
        amount=payment_data.amount,
        currency=payment_data.currency,
        key=settings.RAZORPAY_KEY_ID
    )

@router.post("/verify", response_model=PaymentResponse)
async def verify_payment(
    verification: PaymentVerification,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    payment = db.query(Payment).filter(
        Payment.razorpay_order_id == verification.razorpay_order_id,
        Payment.user_id == current_user.id
    ).first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    try:
        params_dict = {
            "razorpay_order_id": verification.razorpay_order_id,
            "razorpay_payment_id": verification.razorpay_payment_id,
            "razorpay_signature": verification.razorpay_signature
        }
        client.utility.verify_payment_signature(params_dict)
        
        payment.razorpay_payment_id = verification.razorpay_payment_id
        payment.razorpay_signature = verification.razorpay_signature
        payment.status = "completed"
        
        enrollment = db.query(Enrollment).filter(
            Enrollment.user_id == current_user.id,
            Enrollment.course_id == payment.course_id
        ).first()
        
        if not enrollment:
            enrollment = Enrollment(
                user_id=current_user.id,
                course_id=payment.course_id,
                status="enrolled"
            )
            db.add(enrollment)
        
        db.commit()
        db.refresh(payment)
        return payment
        
    except razorpay.errors.SignatureVerificationError:
        payment.status = "failed"
        payment.failure_reason = "Signature verification failed"
        db.commit()
        raise HTTPException(status_code=400, detail="Payment verification failed")

@router.get("/history", response_model=list[PaymentResponse])
async def get_payment_history(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    payments = db.query(Payment).filter(Payment.user_id == current_user.id).all()
    return payments

@router.post("/webhook")
async def payment_webhook(request: dict, db: Session = Depends(get_db)):
    event = request.get("event")
    payload = request.get("payload", {})
    
    if event == "payment.captured":
        payment_id = payload.get("payment", {}).get("entity", {}).get("id")
        order_id = payload.get("payment", {}).get("entity", {}).get("order_id")
        
        payment = db.query(Payment).filter(
            Payment.razorpay_payment_id == payment_id
        ).first()
        
        if payment:
            payment.status = "completed"
            db.commit()
    
    return {"status": "ok"}



