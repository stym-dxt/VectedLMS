#!/usr/bin/env bash
# Run this script ON THE SERVER as root from /var/www/vectedlms.
# Fixes Nginx for students subdomain and ensures port matches FRONTEND_PORT in .env.
set -e

cd "$(dirname "$0")"
CONFIG="/etc/nginx/sites-available/vectedlms"
ENABLED="/etc/nginx/sites-enabled/vectedlms"

# Use FRONTEND_PORT from .env so Nginx proxies to the same port the container uses
FRONTEND_PORT=3005
if [ -f .env ]; then
  val=$(grep -E '^FRONTEND_PORT=' .env 2>/dev/null | cut -d= -f2)
  [ -n "$val" ] && FRONTEND_PORT=$val
fi

echo "Using FRONTEND_PORT=$FRONTEND_PORT (must match docker compose)"

cat > "$CONFIG" << NGINX_EOF
server {
    listen 80;
    server_name students.vectorskillacademy.com students.vectorskillaacademy.com;

    location / {
        proxy_pass http://127.0.0.1:${FRONTEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX_EOF

ln -sf "$CONFIG" "$ENABLED"
nginx -t && systemctl reload nginx
echo "Nginx reloaded. If you see Bad Gateway, start the stack: cd /var/www/vectedlms && docker compose up -d"
