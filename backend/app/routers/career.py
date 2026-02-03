from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.models.career import InterviewPrep, Resume, ClientConnection
from app.schemas.career import (
    InterviewPrepCreate, InterviewPrepUpdate, InterviewPrepResponse,
    ResumeCreate, ResumeUpdate, ResumeResponse,
    ClientConnectionCreate, ClientConnectionResponse
)

router = APIRouter()

@router.get("/interview-prep", response_model=List[InterviewPrepResponse])
async def get_interview_preps(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    preps = db.query(InterviewPrep).filter(InterviewPrep.user_id == current_user.id).all()
    return preps

@router.post("/interview-prep", response_model=InterviewPrepResponse, status_code=status.HTTP_201_CREATED)
async def create_interview_prep(
    prep_data: InterviewPrepCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    new_prep = InterviewPrep(user_id=current_user.id, **prep_data.dict())
    db.add(new_prep)
    db.commit()
    db.refresh(new_prep)
    return new_prep

@router.put("/interview-prep/{prep_id}", response_model=InterviewPrepResponse)
async def update_interview_prep(
    prep_id: int,
    prep_update: InterviewPrepUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    prep = db.query(InterviewPrep).filter(
        InterviewPrep.id == prep_id,
        InterviewPrep.user_id == current_user.id
    ).first()
    if not prep:
        raise HTTPException(status_code=404, detail="Interview prep not found")
    
    update_data = prep_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(prep, field, value)
    db.commit()
    db.refresh(prep)
    return prep

@router.get("/resumes", response_model=List[ResumeResponse])
async def get_resumes(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).all()
    return resumes

@router.post("/resumes", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def create_resume(
    resume_data: ResumeCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    new_resume = Resume(user_id=current_user.id, **resume_data.dict())
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)
    return new_resume

@router.put("/resumes/{resume_id}", response_model=ResumeResponse)
async def update_resume(
    resume_id: int,
    resume_update: ResumeUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    update_data = resume_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(resume, field, value)
    db.commit()
    db.refresh(resume)
    return resume

@router.get("/client-connections", response_model=List[ClientConnectionResponse])
async def get_client_connections(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    connections = db.query(ClientConnection).filter(
        ClientConnection.user_id == current_user.id
    ).all()
    return connections

@router.post("/client-connections", response_model=ClientConnectionResponse, status_code=status.HTTP_201_CREATED)
async def create_client_connection(
    connection_data: ClientConnectionCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    new_connection = ClientConnection(user_id=current_user.id, **connection_data.dict())
    db.add(new_connection)
    db.commit()
    db.refresh(new_connection)
    return new_connection



