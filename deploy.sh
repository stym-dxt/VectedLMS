#!/usr/bin/env bash
# Run this script ON THE SERVER from the project root (e.g. /var/www/vectedlms).
# Ensures repo is present/updated, rebuilds and starts containers. Does not touch existing apps.

set -e
cd "$(dirname "$0")"

echo "==> VectedLMS deploy"

if [ ! -d .git ]; then
  echo "==> Git repo not found. Cloning..."
  git clone https://github.com/stym-dxt/VectedLMS.git .
fi

echo "==> Pulling latest..."
git fetch origin
git checkout -B main origin/main 2>/dev/null || git pull origin main

if [ ! -f .env ]; then
  echo "ERROR: .env not found. Copy from .env.example and set production values. See DEPLOYMENT.md"
  exit 1
fi

echo "==> Building and starting containers..."
docker compose build --no-cache
docker compose up -d

echo "==> Running migrations..."
docker compose exec -T backend alembic upgrade head

echo "==> Done. Check: docker compose ps"
echo "==> Ensure Nginx is configured for your subdomain (see DEPLOYMENT.md)."
