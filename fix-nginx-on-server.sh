#!/usr/bin/env bash
# Run this script ON THE SERVER as root. Fixes Nginx so students.vectorskillacademy.com serves VectedLMS, not another site.
set -e

CONFIG="/etc/nginx/sites-available/vectedlms"
ENABLED="/etc/nginx/sites-enabled/vectedlms"

cat > "$CONFIG" << 'NGINX_EOF'
server {
    listen 80;
    server_name students.vectorskillacademy.com students.vectorskillaacademy.com;

    location / {
        proxy_pass http://127.0.0.1:3005;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX_EOF

ln -sf "$CONFIG" "$ENABLED"
nginx -t && systemctl reload nginx
echo "Done. students.vectorskillacademy.com now points to VectedLMS (port 3005)."
