from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import logging
from app.core.config import settings
from app.core.database import engine, Base
from app.routers import auth, users, courses, payments, content, live_classes, notes, roadmaps, certifications, career, testimonials, onboarding, admin, video

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created/verified successfully")
except Exception as e:
    logger.error(f"Error creating database tables: {str(e)}", exc_info=True)

app = FastAPI(
    title="Vector Skill Academy LMS",
    description="Learning Management System for Vector Skill Academy",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors with detailed messages."""
    errors = []
    error_details = []
    for error in exc.errors():
        field_path = " -> ".join(str(loc) for loc in error.get("loc", []))
        message = error.get("msg", "Validation error")
        error_type = error.get("type", "unknown")
        input_value = error.get("input", "N/A")
        
        error_msg = f"{field_path}: {message}"
        errors.append(error_msg)
        error_details.append({
            "field": field_path,
            "message": message,
            "type": error_type,
            "input": str(input_value)[:100]  # Limit input length in logs
        })
    
    # Log detailed validation error
    logger.error(f"Validation error on {request.method} {request.url.path}")
    for detail in error_details:
        logger.error(f"  - {detail['field']}: {detail['message']} (type: {detail['type']}, input: {detail['input']})")
    
    # Return user-friendly error message
    if len(errors) == 1:
        error_message = errors[0]
    else:
        error_message = "Multiple validation errors: " + "; ".join(errors)
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": error_message,
            "errors": exc.errors()
        }
    )

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(courses.router, prefix="/api/courses", tags=["Courses"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])
app.include_router(content.router, prefix="/api/content", tags=["Content"])
app.include_router(live_classes.router, prefix="/api/live-classes", tags=["Live Classes"])
app.include_router(notes.router, prefix="/api/notes", tags=["Notes"])
app.include_router(roadmaps.router, prefix="/api/roadmaps", tags=["Roadmaps"])
app.include_router(certifications.router, prefix="/api/certifications", tags=["Certifications"])
app.include_router(career.router, prefix="/api/career", tags=["Career Services"])
app.include_router(testimonials.router, prefix="/api/testimonials", tags=["Testimonials"])
app.include_router(onboarding.router, prefix="/api/onboarding", tags=["Onboarding"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(video.router, prefix="/api/video", tags=["Video"])

@app.get("/")
async def root():
    return {"message": "Vector Skill Academy LMS API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

