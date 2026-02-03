from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.models.note import Note
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse

router = APIRouter()

@router.get("", response_model=List[NoteResponse])
async def get_notes(
    lesson_id: int = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    query = db.query(Note).filter(Note.user_id == current_user.id)
    if lesson_id:
        query = query.filter(Note.lesson_id == lesson_id)
    return query.all()

@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(
    note_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    note = db.query(Note).filter(
        Note.id == note_id,
        Note.user_id == current_user.id
    ).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.post("", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
async def create_note(
    note_data: NoteCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    new_note = Note(
        user_id=current_user.id,
        **note_data.dict()
    )
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note

@router.put("/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: int,
    note_update: NoteUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    note = db.query(Note).filter(
        Note.id == note_id,
        Note.user_id == current_user.id
    ).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    update_data = note_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(note, field, value)
    db.commit()
    db.refresh(note)
    return note

@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(
    note_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    note = db.query(Note).filter(
        Note.id == note_id,
        Note.user_id == current_user.id
    ).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()



