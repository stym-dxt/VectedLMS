# How to Check Registration Logs

## Issue: Users not being created at signup

### Step 1: Check if Backend is Running

```bash
# Check if backend is running on port 8000
lsof -ti:8000

# Or check if Docker containers are running
docker-compose ps
```

### Step 2: View Backend Logs

#### If using Docker:
```bash
cd /Users/stymdxt/Desktop/projects/VectedLMS
docker-compose logs backend --tail=100 --follow
```

#### If running locally:
The logs will appear in the terminal where you started uvicorn. Look for:
- `Registration attempt for email: ...`
- `Error during registration: ...`
- `Database integrity error: ...`

### Step 3: Test Registration Endpoint Directly

```bash
# Test the registration endpoint
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "full_name": "Test User"
  }'
```

### Step 4: Check Database Connection

```bash
# If using Docker
docker-compose exec db psql -U vectedlms -d vectedlms -c "SELECT COUNT(*) FROM users;"

# Check if users table exists
docker-compose exec db psql -U vectedlms -d vectedlms -c "\d users"
```

### Step 5: Common Issues

1. **Backend not running**: Start with `docker-compose up backend` or `uvicorn app.main:app --reload`
2. **Database not connected**: Check DATABASE_URL in .env file
3. **Port conflict**: Another service is using port 8000 (check with `lsof -ti:8000`)
4. **Database migrations not run**: Run `alembic upgrade head`

### Step 6: Enable More Detailed Logging

The registration endpoint now has detailed logging at each step:
- Registration attempt received
- Email check
- Password hashing
- Database commit
- Success/failure

Check the logs for these messages to identify where the process is failing.


