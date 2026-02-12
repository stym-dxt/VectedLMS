#!/usr/bin/env bash
# Run ON THE SERVER as root when Docker is not installed. Installs Docker then starts the LMS stack.
# Usage: cd /var/www/vectedlms && sudo bash install-docker-and-up.sh
set -e

cd "$(dirname "$0")"

if ! command -v docker &>/dev/null; then
  echo "Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
fi

if ! docker compose version &>/dev/null; then
  echo "Installing Docker Compose plugin..."
  apt-get update -qq && apt-get install -y docker-compose-plugin 2>/dev/null || true
fi

echo "Docker: $(docker --version). Compose: $(docker compose version 2>/dev/null || echo 'install docker-compose-plugin if needed')."
echo "Starting stack..."
docker compose up -d
docker compose exec -T backend alembic upgrade head 2>/dev/null || true
echo "Done. Check: docker compose ps. Then visit https://students.vectorskillacademy.com"
