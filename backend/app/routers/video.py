import os
import aiofiles
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.core.dependencies import get_current_active_user, require_admin
from app.models.user import User
from app.models.content import VideoContent
from app.models.course import Lesson

router = APIRouter()

ALLOWED_EXTENSIONS = {'.mp4', '.webm', '.ogg'}

@router.post("/upload")
async def upload_video(
    file: UploadFile = File(...),
    lesson_id: int = None,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    os.makedirs(settings.VIDEO_DIR, exist_ok=True)
    
    file_path = os.path.join(settings.VIDEO_DIR, file.filename)
    
    file_size = 0
    async with aiofiles.open(file_path, 'wb') as f:
        while chunk := await file.read(1024 * 1024):
            file_size += len(chunk)
            if file_size > settings.MAX_UPLOAD_SIZE:
                os.remove(file_path)
                raise HTTPException(
                    status_code=400,
                    detail=f"File size exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE / (1024*1024)}MB"
                )
            await f.write(chunk)
    
    video_content = VideoContent(
        lesson_id=lesson_id,
        title=file.filename,
        file_path=file_path,
        file_size=file_size
    )
    db.add(video_content)
    db.commit()
    db.refresh(video_content)
    
    if lesson_id:
        lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
        if lesson:
            lesson.video_url = f"/api/video/stream/{video_content.id}"
            db.commit()
    
    return {
        "id": video_content.id,
        "title": video_content.title,
        "file_path": video_content.file_path,
        "file_size": video_content.file_size,
        "stream_url": f"/api/video/stream/{video_content.id}"
    }

@router.get("/stream/{video_id}")
async def stream_video(
    video_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    video = db.query(VideoContent).filter(VideoContent.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    if not os.path.exists(video.file_path):
        raise HTTPException(status_code=404, detail="Video file not found")
    
    file_like = open(video.file_path, mode="rb")
    return StreamingResponse(file_like, media_type="video/mp4")



