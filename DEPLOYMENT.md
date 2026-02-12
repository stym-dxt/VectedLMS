# VectedLMS – Deployment to production server

This guide deploys VectedLMS on a **shared host** where other apps already run. The app is isolated in its own directory, uses its own Docker Compose project, and is exposed via a **new** Nginx server block only (no changes to existing sites).

---

## 1. Server overview

- **Host:** Your production server (IP: `188.241.62.118` in your setup).
- **User:** `root` (or a dedicated user with Docker access).
- **Goal:** Run VectedLMS in a dedicated directory, with Git repo present and updated, without touching existing applications.

---

## 2. One-time setup on the server

### 2.1 SSH into the server

```bash
ssh root@188.241.62.118
```

(Use your actual password or SSH key.)

### 2.2 Create a dedicated directory for VectedLMS

Pick a path that does not conflict with existing apps. Common choices:

- `/var/www/vectedlms`
- `/opt/vectedlms`

Example:

```bash
sudo mkdir -p /var/www/vectedlms
cd /var/www/vectedlms
```

### 2.3 Clone the Git repo (or create and add remote)

If the repo **does not exist** on the server yet:

```bash
cd /var/www/vectedlms
git clone https://github.com/stym-dxt/VectedLMS.git .
```

If the directory already exists and you want to **init and add remote**:

```bash
cd /var/www/vectedlms
git init
git remote add origin https://github.com/stym-dxt/VectedLMS.git
git fetch origin
git checkout -b main origin/main
```

Confirm Git is correct:

```bash
git status
git remote -v
```

### 2.4 Install Docker and Docker Compose (if not already)

Only if your server does not have Docker yet:

```bash
curl -fsSL https://get.docker.com | sh
```

Existing apps are unaffected as long as you only run `docker-compose` from the VectedLMS directory.

### 2.5 Create production `.env`

Create `.env` in the **project root** (e.g. `/var/www/vectedlms/.env`). Do **not** commit this file.

```bash
cd /var/www/vectedlms
cp .env.example .env
nano .env   # or vim
```

Set at least:

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` – use strong values in production.
- `POSTGRES_PORT` – use a port **not** used by other apps (e.g. `5434` if 5433 is taken).
- `BACKEND_PORT` – free port for backend only if you need direct access (e.g. `8005`).
- `FRONTEND_PORT` – free port for the frontend container (e.g. `3005`). Nginx will proxy to this.
- `SECRET_KEY` – long random string for JWT.
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` – your Razorpay production keys.
- `CORS_ORIGINS` – your public frontend URL: `https://students.vectorskillaacademy.com`.
- `ENVIRONMENT=production`
- `VITE_API_URL` – `https://students.vectorskillaacademy.com` so API calls go to the same origin; the frontend uses `/api` which Nginx will proxy to the backend.

Example (custom ports to avoid clashes with existing apps):

```env
POSTGRES_USER=vectedlms
POSTGRES_PASSWORD=<strong-password>
POSTGRES_DB=vectedlms
POSTGRES_PORT=5434

BACKEND_PORT=8005
FRONTEND_PORT=3005

SECRET_KEY=<generate-a-long-random-secret>
RAZORPAY_KEY_ID=<your-live-key>
RAZORPAY_KEY_SECRET=<your-live-secret>
CORS_ORIGINS=https://students.vectorskillaacademy.com
ENVIRONMENT=production
VITE_API_URL=https://students.vectorskillaacademy.com
```

---

## 3. Build and run the app (isolated from other apps)

From the project root on the server:

```bash
cd /var/www/vectedlms
docker compose build --no-cache
docker compose up -d
```

Check that only VectedLMS containers are running (optional):

```bash
docker compose ps
```

Run migrations:

```bash
docker compose exec backend alembic upgrade head
```

Your existing Docker projects (other sites) are separate; this only runs the stack in this directory.

---

## 4. Nginx reverse proxy (new config only – do not edit existing sites)

So that existing websites are **not** modified, add **one new** config file and reload Nginx.

### 4.1 Create a new Nginx config for VectedLMS

Create a file **only for this app**, for example:

- **Debian/Ubuntu:** `/etc/nginx/sites-available/vectedlms`
- **Other:** `/etc/nginx/conf.d/vectedlms.conf`

Example content (replace port `3005` if you used another `FRONTEND_PORT`):

```nginx
server {
    listen 80;
    server_name students.vectorskillaacademy.com;

    location / {
        proxy_pass http://127.0.0.1:3005;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://127.0.0.1:8005;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

If your backend is only reachable via the frontend container (same network), use:

- `proxy_pass http://127.0.0.1:3005` for both `/` and `/api` (frontend nginx already proxies `/api` to backend). Then you only need `FRONTEND_PORT=3005` and no need to expose backend port.

So a **simpler** single upstream is:

```nginx
server {
    listen 80;
    server_name students.vectorskillaacademy.com;

    location / {
        proxy_pass http://127.0.0.1:3005;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site (Debian/Ubuntu):

```bash
sudo ln -s /etc/nginx/sites-available/vectedlms /etc/nginx/sites-enabled/
```

Test and reload Nginx:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Do **not** edit existing server blocks; this adds a new one only.

---

## 5. SSL (recommended)

Use Certbot so existing certs/sites are untouched:

```bash
sudo certbot --nginx -d students.vectorskillaacademy.com
```

Certbot will add SSL to the new server block only.

---

## 6. Keeping the repo updated on the server

On the server, to pull latest and rebuild:

```bash
cd /var/www/vectedlms
git pull origin main
docker compose build --no-cache
docker compose up -d
docker compose exec backend alembic upgrade head
```

You can put this in a script (e.g. `deploy.sh` in the repo) and run it when you want to deploy updates.

---

## 7. GoDaddy – where to set the subdomain

To point your subdomain to this server:

1. Log in to **GoDaddy** → **My Products** → **DNS** (or **Manage DNS**) for **vectorskillaacademy.com**.
2. Under **DNS Records** (or **Records**), **Add** a new record:
   - **Type:** `A`
   - **Name:** `students` (full hostname: `students.vectorskillaacademy.com`).
   - **Value / Points to:** `188.241.62.118`
   - **TTL:** 600 or default.
3. Save.

Result: `students.vectorskillaacademy.com` will resolve to your server. Nginx will serve VectedLMS on that hostname.

**Summary:** Add an **A record** for **vectorskillaacademy.com** with **Name = `students`**, **Value = `188.241.62.118`**.

---

## 8. Site down? Bring it up

If the A record is set on GoDaddy but the site is still down, on the server run:

```bash
cd /var/www/vectedlms
git pull origin main
./ensure-env-and-up.sh
```

This sets `CORS_ORIGINS` and `VITE_API_URL` to `https://students.vectorskillaacademy.com`, rebuilds and starts the stack. Then ensure Nginx is serving the subdomain:

- Add (or fix) a server block with `server_name students.vectorskillaacademy.com;` and `proxy_pass http://127.0.0.1:3005;` (see `nginx-vectedlms.conf.example`).
- Run: `sudo nginx -t && sudo systemctl reload nginx`
- If using HTTPS: `sudo certbot --nginx -d students.vectorskillaacademy.com`

---

## 9. Checklist

- [ ] Directory created (e.g. `/var/www/vectedlms`), repo cloned or inited and remote set, `git pull` works.
- [ ] `.env` created with production values and ports that do not conflict with existing apps.
- [ ] `docker compose up -d` and `alembic upgrade head` run successfully.
- [ ] New Nginx config added (no change to existing configs), `nginx -t` and reload done.
- [ ] Optional: Certbot run for `students.vectorskillaacademy.com`.
- [ ] GoDaddy: A record for `students` (under vectorskillaacademy.com) → `188.241.62.118`.
- [ ] After DNS propagates, open `https://students.vectorskillaacademy.com` and verify login/API.
- [ ] If down: run `./ensure-env-and-up.sh` and check Nginx (Section 8).
