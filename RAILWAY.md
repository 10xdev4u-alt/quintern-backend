# 🚆 Quintern Backend — Railway Deployment Guide

> Deploy the **Quintern API** on Railway for **$0-5/month** — 24/7 uptime, no sleeping, no Docker.

Railway's Hobby plan gives **$5/mo free credits** — enough to run the backend + PostgreSQL around the clock.

**Repo:** [`10xdev4u-alt/quintern-backend`](https://github.com/10xdev4u-alt/quintern-backend)

---

## Step-by-step (10 minutes)

### Step 1 · Create a Railway project

1. Go to **[railway.app](https://railway.app)** → **Sign in with GitHub**
2. **New Project** → **Deploy from GitHub repo**
3. Select **`10xdev4u-alt/quintern-backend`**
4. Railway auto-detects Node.js + reads `railway.json`

### Step 2 · Add PostgreSQL

1. In your project dashboard: **New** → **Database** → **Add PostgreSQL**
2. Railway creates a Postgres instance and auto-injects `DATABASE_URL`
3. The backend picks it up automatically — nothing else needed

### Step 3 · Set root directory

The API code lives in `backend/`. Tell Railway where to look:

1. Go to your backend service → **Settings** tab
2. **Root Directory**: type `backend`
3. Railway rebuilds with the correct context

### Step 4 · Add environment variables

Go to **Variables** tab and add these:

```env
NODE_ENV=production
JWT_SECRET=<run: openssl rand -base64 48 | tr -d '\n'>
JWT_ACCESS_SECRET=<run it again>
JWT_REFRESH_SECRET=<run it again>
CSRF_SECRET=<run it again>
CORS_ORIGIN=https://<your-frontend-url>.vercel.app
AI_PROVIDER=heuristic
RESEND_API_KEY=re_xxxxxxxxxxxx  # optional — for password reset emails
EMAIL_FROM=Quintern <noreply@quintern.com>
```

> **Your Neon DB string** (if you already have one): set it as `DATABASE_URL` in Railway's env vars. Railway's own PG instance also works — either way, the backend connects fine.

### Step 5 · Run migrations

1. Go to your backend service → **Shell** tab
2. Run:

```bash
node src/db/migrate.js
node seeds/seed.js
```

> This creates all tables + enums + indexes, and seeds the admin user (`admin@internops.com` / `Admin@123`).

---

## ✅ Verify it works

```bash
BACKEND=https://<your-project>.up.railway.app

# Health check
curl -fsS $BACKEND/health
# → {"status":"ok","db":"connected","redis":"disabled"}

# Login
curl -fsS -X POST $BACKEND/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@internops.com","password":"Admin@123"}'
# → {"accessToken":"...", "user":{...}}
```

---

## ⚙️ What's in the repo

| File | Purpose |
|------|---------|
| `railway.json` | Build + deploy config (Nixpacks, healthcheck) |
| `backend/` | Fastify API — all routes, middleware, DB logic |
| `backend/.env.example` | All env vars documented |
| `backend/src/db/migrate.js` | SQL migration runner |
| `backend/seeds/seed.js` | Admin + demo data seeder |

---

## 🔊 Reminder

The **frontend** (`quintern-frontend`) deploys separately on **Vercel**. Once it's live, set `CORS_ORIGIN` here to your Vercel URL, and set `VITE_API_BASE` there to this Railway URL.

---

## 💰 Cost

| Item | Cost |
|------|------|
| Backend (Railway Hobby) | ~$3-4/mo in usage (covered by $5 free credits) |
| PostgreSQL (Railway) | Included in credits |
| **Total** | **$0-1/mo** |
