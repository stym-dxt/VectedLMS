#!/bin/bash

if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "Please update .env file with your configuration"
fi

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Running database migrations..."
alembic upgrade head

echo "Starting server..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload



