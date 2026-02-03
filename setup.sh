#!/bin/bash

echo "Setting up Vector Skill Academy LMS..."

if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "Please update .env file with your configuration before continuing"
    echo "Press Enter to continue after updating .env..."
    read
fi

echo "Building Docker images..."
docker-compose build

echo "Starting services..."
docker-compose up -d db

echo "Waiting for database to be ready..."
sleep 5

echo "Running database migrations..."
docker-compose exec -T backend alembic upgrade head || echo "Migrations will run when backend starts"

echo "Starting all services..."
docker-compose up -d

echo "Setup complete!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"



