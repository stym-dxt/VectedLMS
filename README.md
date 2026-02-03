# Vector Skill Academy LMS

A comprehensive Learning Management System platform for Vector Skill Academy, designed to convert prospects into students through an engaging, futuristic experience with gamified content unlocking.

## Features

- **User Management**: Registration, authentication with JWT, role-based access control
- **Course Management**: Full CRUD operations, modules, lessons, locked content system
- **Payment Integration**: Razorpay integration for course purchases
- **Content Delivery**: Self-hosted video streaming, live classes via Google Meet
- **Learning Resources**: Notes, recordings, roadmaps, certifications
- **Career Services**: Interview prep, resume building, client connections
- **Marketing**: Testimonials, services showcase, analytics tracking
- **Admin Panel**: User management, content management, payment analytics

## Tech Stack

### Backend
- FastAPI (Python)
- PostgreSQL
- SQLAlchemy ORM
- Alembic for migrations
- JWT authentication
- Razorpay SDK

### Frontend
- React with TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand for state management
- Axios for API calls

## Prerequisites

- Docker and Docker Compose
- Python 3.11+ (for local development)
- Node.js 18+ (for local development)
- PostgreSQL (if not using Docker)

## Quick Start with Docker

1. Clone the repository:
```bash
cd VectedLMS
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
   - Set `SECRET_KEY` (generate a strong secret key)
   - Add your Razorpay credentials (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`)
   - Configure database credentials if needed

4. Start all services:
```bash
docker-compose up -d
```

5. Run database migrations:
```bash
docker-compose exec backend alembic upgrade head
```

6. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Local Development Setup

### Backend

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Run database migrations:
```bash
alembic upgrade head
```

6. Start the server:
```bash
uvicorn app.main:app --reload
```

Or use the startup script:
```bash
./start.sh
```

### Frontend

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

## Database Migrations

Create a new migration:
```bash
cd backend
alembic revision --autogenerate -m "Description of changes"
```

Apply migrations:
```bash
alembic upgrade head
```

## Environment Variables

### Backend (.env in backend/)
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT secret key
- `RAZORPAY_KEY_ID`: Razorpay API key ID
- `RAZORPAY_KEY_SECRET`: Razorpay API secret
- `CORS_ORIGINS`: Comma-separated list of allowed origins
- `GOOGLE_MEET_BASE_URL`: Base URL for Google Meet links
- `UPLOAD_DIR`: Directory for file uploads
- `VIDEO_DIR`: Directory for video files
- `MAX_UPLOAD_SIZE`: Maximum upload size in bytes

### Frontend
- `VITE_API_URL`: Backend API URL

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/{id}` - Get course details
- `POST /api/courses` - Create course (admin)
- `PUT /api/courses/{id}` - Update course (admin)
- `POST /api/courses/{id}/enroll` - Enroll in course

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/history` - Get payment history

### Content
- `GET /api/content/lesson/{id}/access` - Check lesson access
- `POST /api/video/upload` - Upload video (admin)
- `GET /api/video/stream/{id}` - Stream video

### Live Classes
- `GET /api/live-classes` - List live classes
- `POST /api/live-classes` - Create live class (admin)

### Notes
- `GET /api/notes` - List user notes
- `POST /api/notes` - Create note
- `PUT /api/notes/{id}` - Update note
- `DELETE /api/notes/{id}` - Delete note

### Roadmaps
- `GET /api/roadmaps` - List roadmaps
- `GET /api/roadmaps/{id}` - Get roadmap details

### Certifications
- `GET /api/certifications` - List user certifications
- `POST /api/certifications/{course_id}/generate` - Generate certificate

### Career Services
- `GET /api/career/interview-prep` - List interview preps
- `POST /api/career/interview-prep` - Create interview prep
- `GET /api/career/resumes` - List resumes
- `POST /api/career/resumes` - Create resume

### Testimonials
- `GET /api/testimonials` - List testimonials
- `POST /api/testimonials` - Create testimonial

### Onboarding
- `GET /api/onboarding` - Get onboarding steps
- `POST /api/onboarding` - Create/update onboarding step

### Admin
- `GET /api/admin/users` - List all users
- `GET /api/admin/stats` - Get admin statistics
- `GET /api/admin/payments` - List all payments

## Deployment to Azure

### Prerequisites
- Azure account
- Azure Container Registry (ACR)
- Azure Database for PostgreSQL
- Azure App Service or Azure Container Instances

### Steps

1. **Build and push Docker images to ACR:**
```bash
az acr build --registry <your-registry> --image vectedlms-backend:latest ./backend
az acr build --registry <your-registry> --image vectedlms-frontend:latest ./frontend
```

2. **Create Azure Database for PostgreSQL:**
   - Use Azure Portal or Azure CLI
   - Note the connection string

3. **Configure App Service:**
   - Set environment variables in App Service configuration
   - Update `DATABASE_URL` with Azure PostgreSQL connection string
   - Set all required environment variables

4. **Deploy:**
   - Use Azure App Service with Docker containers
   - Or use Azure Container Instances with docker-compose

### Environment Variables for Azure

Set these in Azure App Service Configuration:
- All backend environment variables
- `DATABASE_URL`: Azure PostgreSQL connection string
- `CORS_ORIGINS`: Your frontend domain

## Project Structure

```
VectedLMS/
├── backend/
│   ├── app/
│   │   ├── core/          # Core configuration
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── routers/       # API routes
│   │   └── main.py        # FastAPI app
│   ├── alembic/          # Database migrations
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # State management
│   │   ├── lib/           # Utilities
│   │   └── App.tsx
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── .env.example
```

## Testing

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm run format:check
npm run build
```

## License

Proprietary - Vector Skill Academy



