# Deployment Guide

**Project:** Jewelry Store Management System  

---

## 1. Prerequisites

- Node.js 20 or later
- MySQL 8
- npm (or yarn/pnpm)

---

## 2. Environment Setup

### 2.1 Clone and Install

```bash
git clone <repository-url>
cd jewelry-store-nextjs
npm install
```

### 2.2 Database

1. Create database: `CREATE DATABASE IF NOT EXISTS jewelry_store;`
2. Load schema: `mysql -u root -p jewelry_store < db.sql`
3. Ensure MySQL user has privileges on jewelry_store

### 2.3 Environment Variables

Create `.env` in project root:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/jewelry_store"
# OR: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT

AUTH_SECRET="your-long-random-secret"
JWT_SECRET="your-long-random-secret"

NEXT_PUBLIC_UPLOAD_DIR="/uploads"
```

Use a strong random value for AUTH_SECRET in production (e.g. `openssl rand -base64 32`).

---

## 3. Development

```bash
npm run dev
```

App at http://localhost:3000. Login with a user from the users table.

---

## 4. Production Build and Run

```bash
npm run build
npm run start
```

- build produces optimized output in .next
- start runs production server (default port 3000; set PORT if needed)

---

## 5. Production Deployment

- Deploy on any Node.js host (VPS, Railway, Render, Vercel with external MySQL).
- Set environment variables; run `npm run build && npm run start` (or platform build/start).
- Use managed MySQL (e.g. AWS RDS) or self-hosted; ensure app can reach DB (firewall).
- Use HTTPS (reverse proxy or platform).
- If using local public/uploads, ensure directory exists and is writable; for multi-instance consider object storage.

### Nginx reverse proxy example

Proxy requests to http://127.0.0.1:3000; set Host, X-Real-IP, X-Forwarded-For, X-Forwarded-Proto. Use SSL (e.g. Let's Encrypt) for HTTPS.

### PM2 example

```bash
npm run build
pm2 start npm --name "jewelry-store" -- start
pm2 save
pm2 startup
```

---

## 6. Uploads

Default: public/uploads for customer/company images. Create directory and set permissions; ensure process can write in production.

---

## 7. Health Checks

- Open /login to confirm app loads.
- Call protected API (e.g. GET /api/dashboard/stats) with valid auth to confirm DB and auth.

---

## 8. Troubleshooting

- DB connection failed: Check DB_* or DATABASE_URL; ensure MySQL is reachable.
- 401 on API: Ensure session or Bearer token; check AUTH_SECRET.
- Blank invoice print: Data must be in localStorage before opening print window.
- MySQL collation errors: See codebase for CONVERT/COLLATE usage on currency_rates.
