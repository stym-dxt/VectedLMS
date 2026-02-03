from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.models.onboarding import OnboardingStep
from app.schemas.onboarding import OnboardingStepCreate, OnboardingStepUpdate, OnboardingStepResponse

router = APIRouter()

@router.get("", response_model=List[OnboardingStepResponse])
async def get_onboarding_steps(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    steps = db.query(OnboardingStep).filter(
        OnboardingStep.user_id == current_user.id
    ).order_by(OnboardingStep.created_at).all()
    return steps

@router.post("", response_model=OnboardingStepResponse, status_code=status.HTTP_201_CREATED)
async def create_onboarding_step(
    step_data: OnboardingStepCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    existing_step = db.query(OnboardingStep).filter(
        OnboardingStep.user_id == current_user.id,
        OnboardingStep.step_name == step_data.step_name
    ).first()
    
    if existing_step:
        update_data = step_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(existing_step, field, value)
        db.commit()
        db.refresh(existing_step)
        return existing_step
    
    new_step = OnboardingStep(user_id=current_user.id, **step_data.dict())
    db.add(new_step)
    db.commit()
    db.refresh(new_step)
    return new_step

@router.put("/{step_id}", response_model=OnboardingStepResponse)
async def update_onboarding_step(
    step_id: int,
    step_update: OnboardingStepUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    step = db.query(OnboardingStep).filter(
        OnboardingStep.id == step_id,
        OnboardingStep.user_id == current_user.id
    ).first()
    
    if not step:
        raise HTTPException(status_code=404, detail="Onboarding step not found")
    
    update_data = step_update.dict(exclude_unset=True)
    if update_data.get("is_completed") and not step.is_completed:
        from datetime import datetime
        step.completed_at = datetime.utcnow()
    
    for field, value in update_data.items():
        if field != "is_completed" or not value:
            setattr(step, field, value)
    
    db.commit()
    db.refresh(step)
    return step



