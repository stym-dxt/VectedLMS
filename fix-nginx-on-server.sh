#!/usr/bin/env bash
# Run ON THE SERVER as root. Usage: cd /var/www/vectedlms && sudo bash fix-nginx-on-server.sh
# Puts config in conf.d so it is always loaded and wins for students.vectorskillacademy.com.
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Port from .env (must match docker compose frontend)
FRONTEND_PORT=3005
[ -f .env ] && val=$(grep -E '^FRONTEND_PORT=' .env 2>/dev/null | cut -d= -f2) && [ -n "$val" ] && FRONTEND_PORT=$val

# Write to conf.d so Nginx definitely loads it (sites-enabled may not be included on all servers)
CONF_D="/etc/nginx/conf.d/vectedlms-students.conf"
CERT_DIR="/etc/letsencrypt/live/students.vectorskillacademy.com"
HAVE_SSL=false
[ -f "$CERT_DIR/fullchain.pem" ] && [ -f "$CERT_DIR/privkey.pem" ] && HAVE_SSL=true

echo "FRONTEND_PORT=$FRONTEND_PORT | SSL cert present: $HAVE_SSL"

# Single config file: HTTP always; HTTPS only if cert exists
{
  echo "server {"
  echo "    listen 80;"
  echo "    server_name students.vectorskillacademy.com students.vectorskillaacademy.com;"
  echo "    location / {"
  echo "        proxy_pass http://127.0.0.1:${FRONTEND_PORT};"
  echo "        proxy_http_version 1.1;"
  echo "        proxy_set_header Host \$host;"
  echo "        proxy_set_header X-Real-IP \$remote_addr;"
  echo "        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;"
  echo "        proxy_set_header X-Forwarded-Proto \$scheme;"
  echo "    }"
  echo "}"
  if [ "$HAVE_SSL" = true ]; then
    echo "server {"
    echo "    listen 443 ssl;"
    echo "    server_name students.vectorskillacademy.com students.vectorskillaacademy.com;"
    echo "    ssl_certificate $CERT_DIR/fullchain.pem;"
    echo "    ssl_certificate_key $CERT_DIR/privkey.pem;"
    [ -f /etc/letsencrypt/options-ssl-nginx.conf ] && echo "    include /etc/letsencrypt/options-ssl-nginx.conf;"
    [ -f /etc/letsencrypt/ssl-dhparams.pem ] && echo "    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;"
    echo "    location / {"
    echo "        proxy_pass http://127.0.0.1:${FRONTEND_PORT};"
    echo "        proxy_http_version 1.1;"
    echo "        proxy_set_header Host \$host;"
    echo "        proxy_set_header X-Real-IP \$remote_addr;"
    echo "        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;"
    echo "        proxy_set_header X-Forwarded-Proto \$scheme;"
    echo "    }"
    echo "}"
  fi
} > "$CONF_D"

# Remove old config from sites-enabled so it doesn't conflict (we use conf.d only now)
rm -f /etc/nginx/sites-enabled/vectedlms 2>/dev/null || true

nginx -t && systemctl reload nginx
echo "Nginx reloaded. Config: $CONF_D"
if [ "$HAVE_SSL" = false ]; then
  echo "For HTTPS run: sudo certbot --nginx -d students.vectorskillacademy.com"
fi
echo "If still wrong site: ensure no other server block uses default_server for 80/443 for this host."
