from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_active_user, require_admin
from app.models.user import User
from app.models.roadmap import Roadmap
from app.schemas.roadmap import RoadmapCreate, RoadmapUpdate, RoadmapResponse

router = APIRouter()

@router.get("", response_model=List[RoadmapResponse])
async def get_roadmaps(
    category: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(Roadmap).filter(Roadmap.is_active == True)
    if category:
        query = query.filter(Roadmap.category == category)
    return query.order_by(Roadmap.order).all()

@router.get("/{roadmap_id}", response_model=RoadmapResponse)
async def get_roadmap(roadmap_id: int, db: Session = Depends(get_db)):
    roadmap = db.query(Roadmap).filter(Roadmap.id == roadmap_id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    return roadmap

@router.post("", response_model=RoadmapResponse, status_code=status.HTTP_201_CREATED)
async def create_roadmap(
    roadmap_data: RoadmapCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    new_roadmap = Roadmap(**roadmap_data.dict())
    db.add(new_roadmap)
    db.commit()
    db.refresh(new_roadmap)
    return new_roadmap

@router.put("/{roadmap_id}", response_model=RoadmapResponse)
async def update_roadmap(
    roadmap_id: int,
    roadmap_update: RoadmapUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    roadmap = db.query(Roadmap).filter(Roadmap.id == roadmap_id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    
    update_data = roadmap_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(roadmap, field, value)
    db.commit()
    db.refresh(roadmap)
    return roadmap



