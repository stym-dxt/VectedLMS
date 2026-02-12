#!/usr/bin/env bash
# Run ON THE SERVER from project root. Ensures .env has correct domain and brings stack up.
# Usage: ./ensure-env-and-up.sh

set -e
cd "$(dirname "$0")"

DOMAIN="https://students.vectorskillaacademy.com"

echo "==> Ensuring .env exists and has correct domain..."

if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "    Created .env from .env.example"
  else
    echo "ERROR: No .env or .env.example. Run: git pull origin main"
    exit 1
  fi
fi

# Force CORS_ORIGINS and VITE_API_URL so site works with students.vectorskillaacademy.com
if grep -q '^CORS_ORIGINS=' .env 2>/dev/null; then
  sed -i.bak "s|^CORS_ORIGINS=.*|CORS_ORIGINS=$DOMAIN|" .env
else
  echo "CORS_ORIGINS=$DOMAIN" >> .env
fi
if grep -q '^VITE_API_URL=' .env 2>/dev/null; then
  sed -i.bak "s|^VITE_API_URL=.*|VITE_API_URL=$DOMAIN|" .env
else
  echo "VITE_API_URL=$DOMAIN" >> .env
fi
rm -f .env.bak

echo "    CORS_ORIGINS=$DOMAIN"
echo "    VITE_API_URL=$DOMAIN"

echo "==> Rebuilding and starting containers..."
docker compose build --no-cache
docker compose up -d

echo "==> Running migrations..."
docker compose exec -T backend alembic upgrade head 2>/dev/null || true

echo "==> Done. Check: docker compose ps"
echo "==> If site still down: ensure Nginx has server_name students.vectorskillaacademy.com and proxies to FRONTEND_PORT (3005)."
echo "    Then: sudo nginx -t && sudo systemctl reload nginx"
echo "    SSL: sudo certbot --nginx -d students.vectorskillaacademy.com"
