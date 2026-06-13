# Quintern · Deployment Guide

> quin (5) + intern — a 5-tier cohort operations platform.

This guide covers shipping **Quintern** to production for **$0/month** using
free tiers of Vercel, Render, Neon, and Upstash. The repo is already CI-green
on `rajat-wyrm/Quintern` — see `Quintern CI` + `Format Check` workflows.

---

## 💰 The $0-forever stack

| Component    | Platform       | Free tier limit                       | Why this one                |
| ------------ | -------------- | ------------------------------------- | --------------------------- |
| **Frontend** | Vercel         | Unlimited sites, 100GB bandwidth      | Vite-first, auto-deploy     |
| **Backend**  | Render         | 750h/mo web service, sleeps after 15m | Docker, Blueprint, simple   |
| **Postgres** | Neon           | 0.5GB, 191h compute                   | Always-free, REST, branches |
| **Redis**    | Upstash REST   | 10k cmd/day, 256MB                    | No TCP, works serverless    |
| **CI/CD**    | GitHub Actions | 2,000 min/mo (public repo)            | Already wired in repo       |

**Total: $0/month.** All four platforms are kind to hobby/portfolio projects.

> **Caveat:** Render's free web service sleeps after 15 minutes of inactivity.
> The first request after sleep takes ~30 seconds to cold-start. For a demo,
> portfolio, or low-traffic app, this is fine. For always-on production, upgrade
> Render to Starter ($7/mo) or move the backend to Fly.io (~$0-3/mo on the
> smallest VM, no sleep).

---

## 🚀 5-step deploy (about 30 minutes total)

### Step 1 · Neon (postgres) — 3 min

1. Sign up at [neon.tech](https://neon.tech) with GitHub
2. New Project → name `quintern` → region **AWS US East** (or closest to your Render region)
3. Copy the **connection string** from the dashboard:
   ```
   postgresql://neondb_owner:<password>@ep-xxx.us-east-2.aws.neon.tech/quintern?sslmode=require
   ```
4. Save it — you'll paste it into Render in step 3

See [NEON.md](NEON.md) for details.

### Step 2 · Upstash (redis) — 2 min

1. Sign up at [upstash.com](https://upstash.com) with GitHub
2. Create Database → name `quintern` → region **US East**
3. Click the database → **REST API** section → copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

See [UPSTASH.md](UPSTASH.md) for details.

### Step 3 · Render (backend) — 10 min first deploy

1. Sign up at [render.com](https://render.com) with GitHub
2. **New** → **Blueprint** → connect `rajat-wyrm/Quintern` repo
3. Render reads `render.yaml` and shows the plan:
   - `quintern-api` (Docker web service, free)
   - `quintern-web` (static site, free)
4. Click **Apply**. Render builds both.
5. Once the API is up, open `quintern-api` → **Environment** and add:
   - `DATABASE_URL` = the Neon connection string from step 1
   - `UPSTASH_REDIS_REST_URL` = from step 2
   - `UPSTASH_REDIS_REST_TOKEN` = from step 2
   - `GROQ_API_KEY` = from [console.groq.com](https://console.groq.com) (free, optional)
   - `GEMINI_API_KEY` = from [aistudio.google.com](https://aistudio.google.com) (free, optional)
6. Render auto-restarts the service.

See [RENDER.md](RENDER.md) for details.

### Step 4 · Vercel (frontend) — 5 min

1. Sign up at [vercel.com](https://vercel.com) with GitHub
2. **Add New** → **Project** → import `rajat-wyrm/Quintern`
3. Set **Root Directory** = `frontend`
4. Set **Environment Variable**:
   - `VITE_API_BASE` = `https://quintern-api.onrender.com/api`
5. Click **Deploy**

See [VERCEL.md](VERCEL.md) for details.

### Step 5 · Lock it down — 5 min

Once the API URL is live:

1. Update Render env vars:
   - `APP_URL` = `https://quintern-api.onrender.com`
   - `CORS_ORIGIN` = `https://<your-vercel-url>.vercel.app`
2. Open the Render API → **Shell** → run:
   ```bash
   cd backend && node seeds/seed.js
   ```
3. Login at your Vercel URL with:
   - **email**: `admin@internops.com`
   - **password**: `Admin@123`
4. **Change the admin password immediately** via the UI

---

## ✅ Post-deploy verification

```bash
# Replace with your actual URLs
BACKEND=https://quintern-api.onrender.com
FRONTEND=https://quintern-<hash>.vercel.app

# 1. Health
curl -fsS $BACKEND/health
# → {"status":"ok","db":"connected","redis":"connected"}

# 2. Ready (migrations ran)
curl -fsS $BACKEND/api/ready
# → {"status":"ready","checks":{"db":true,"migrations":true}}

# 3. Login as the seeded admin
curl -fsS -H 'Content-Type: application/json' \
  -d '{"email":"admin@internops.com","password":"Admin@123"}' \
  $BACKEND/api/auth/login | jq .accessToken

# 4. Open the frontend in a browser
open $FRONTEND
# → Login page should load, no CORS errors in dev tools
```

---

## 🌍 Custom domains (free)

- **Vercel** → Project → Settings → Domains → `quintern.app`
- **Render** → Service → Settings → Custom Domain → `api.quintern.app`
- Free SSL via Let's Encrypt on both

---

## 🛠 Architecture

```
                    ┌────────────────────────────────────────┐
                    │      Vercel Edge Network (CDN)         │
                    │   https://quintern.app (or .vercel)   │
                    │   Serves the Vite SPA globally         │
                    └──────────────────┬─────────────────────┘
                                       │ /api/* (proxied)
                                       ▼
                    ┌────────────────────────────────────────┐
                    │   Render · quintern-api (Docker)        │
                    │   https://api.quintern.app              │
                    │   Fastify on Node 20+                   │
                    │   Free tier (sleeps after 15m)         │
                    └──────┬──────────┬─────────────┬────────┘
                           │          │             │
                  ┌────────▼─┐  ┌─────▼─────┐  ┌────▼──────────┐
                  │  Neon    │  │  Upstash  │  │  AI providers │
                  │ Postgres │  │   Redis   │  │  Groq/Gemini  │
                  │  (free)  │  │  REST     │  │  + heuristic  │
                  └──────────┘  └───────────┘  └───────────────┘
```

---

## 📋 What's in this repo

- [`render.yaml`](render.yaml) — Render Blueprint (backend + static site)
- [`vercel.json`](vercel.json) — Vercel config (auto-detected, but customizes headers + rewrites)
- [`.github/workflows/ci.yml`](.github/workflows/ci.yml) — Jest + migrations + smoke
- [`.github/workflows/format.yml`](.github/workflows/format.yml) — Prettier check
- [`.github/workflows/release.yml`](.github/workflows/release.yml) — Tag-based release with artifacts
- [`internops.sh`](internops.sh) — One-command local dev / test / seed
- [`DEPLOY.md`](DEPLOY.md) — This file
- [`RENDER.md`](RENDER.md), [`VERCEL.md`](VERCEL.md), [`NEON.md`](NEON.md), [`UPSTASH.md`](UPSTASH.md) — Per-platform deep dives

---

## 🚨 Going beyond $0

When you outgrow the free tiers:

| Need                 | Upgrade               | Cost          |
| -------------------- | --------------------- | ------------- |
| Backend never sleeps | Render Starter plan   | $7/mo         |
| More DB storage      | Neon Launch           | $19/mo (10GB) |
| More Redis commands  | Upstash Pay-as-you-go | $0.20/100k    |
| Custom observability | Sentry free → Team    | $0 → $26/mo   |
| CDN with WAF         | Cloudflare Pro        | $20/mo        |

At 1,000 concurrent users you'd upgrade the backend to 2-4 instances
(Render Standard, $25/mo each), Neon Scale ($69/mo), and add
Cloudflare Pro. Total ~$200/mo — still very cheap for that scale.

---

## See also

- [README.md](README.md) — overview, features, local dev
- [internops.sh](internops.sh) — one-command local dev / test / seed
- [`.github/workflows/`](.github/workflows/) — CI/CD definitions
- [docker-compose.production.yml](docker-compose.production.yml) — self-hosted production stack (alternative)
- [backend/src/config/validateEnv.js](backend/src/config/validateEnv.js) — env validator
