from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.dependencies import get_current_active_user, require_admin
from app.models.user import User
from app.models.course import Course, Module, Lesson, Enrollment
from app.schemas.course import (
    CourseCreate, CourseUpdate, CourseResponse, CourseDetailResponse,
    ModuleCreate, ModuleResponse, LessonCreate, LessonResponse,
    EnrollmentCreate, EnrollmentResponse
)

router = APIRouter()

@router.get("", response_model=List[CourseResponse])
async def get_courses(
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Course)
    if category:
        query = query.filter(Course.category == category)
    if status:
        query = query.filter(Course.status == status)
    else:
        query = query.filter(Course.status == "published")
    return query.all()

@router.get("/{course_id}", response_model=CourseDetailResponse)
async def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.post("", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def create_course(
    course_data: CourseCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    new_course = Course(**course_data.dict())
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

@router.put("/{course_id}", response_model=CourseResponse)
async def update_course(
    course_id: int,
    course_update: CourseUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    update_data = course_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(course, field, value)
    db.commit()
    db.refresh(course)
    return course

@router.post("/{course_id}/modules", response_model=ModuleResponse, status_code=status.HTTP_201_CREATED)
async def create_module(
    course_id: int,
    module_data: ModuleCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    new_module = Module(course_id=course_id, **module_data.dict(exclude={"course_id"}))
    db.add(new_module)
    db.commit()
    db.refresh(new_module)
    return new_module

@router.post("/modules/{module_id}/lessons", response_model=LessonResponse, status_code=status.HTTP_201_CREATED)
async def create_lesson(
    module_id: int,
    lesson_data: LessonCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    new_lesson = Lesson(module_id=module_id, **lesson_data.dict(exclude={"module_id"}))
    db.add(new_lesson)
    db.commit()
    db.refresh(new_lesson)
    return new_lesson

@router.post("/{course_id}/enroll", response_model=EnrollmentResponse, status_code=status.HTTP_201_CREATED)
async def enroll_course(
    course_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    existing_enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == course_id
    ).first()
    
    if existing_enrollment:
        raise HTTPException(status_code=400, detail="Already enrolled")
    
    new_enrollment = Enrollment(
        user_id=current_user.id,
        course_id=course_id,
        status="enrolled"
    )
    db.add(new_enrollment)
    db.commit()
    db.refresh(new_enrollment)
    return new_enrollment

@router.get("/my/enrollments", response_model=List[EnrollmentResponse])
async def get_my_enrollments(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    enrollments = db.query(Enrollment).filter(Enrollment.user_id == current_user.id).all()
    return enrollments



