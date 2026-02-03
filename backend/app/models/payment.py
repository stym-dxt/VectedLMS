from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="INR")
    razorpay_order_id = Column(String, unique=True, nullable=True)
    razorpay_payment_id = Column(String, unique=True, nullable=True)
    razorpay_signature = Column(String, nullable=True)
    status = Column(String, default="pending")
    payment_method = Column(String, nullable=True)
    failure_reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="payments")
    course = relationship("Course")



