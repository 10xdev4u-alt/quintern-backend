# Quintern API

Backend API for **Quintern** — an intern management system. Built with **Fastify**, deployed on **Railway** with **Neon Postgres** and **Upstash Redis**.

## Tech Stack

| Component | Tech |
|-----------|------|
| Runtime | Node.js (Fastify) |
| Database | Neon (Serverless PostgreSQL) |
| Cache/Queue | Upstash Redis |
| Email | Resend |
| Auth | JWT (access + refresh tokens) |
| Hosting | Railway |
| CI | GitHub Actions |

## Quick Start (No Docker)

```bash
# One command — auto-generates secrets, runs migrations, seeds admin
./internops.sh dev-light
```

Or manually:

```bash
cd backend
cp .env.example .env
# Edit .env with your secrets, then:
npm install
PGLITE_DB_DIR=./pglite-data node src/db/migrate.js
PGLITE_DB_DIR=./pglite-data node seeds/seed.js
PGLITE_DB_DIR=./pglite-data node --watch src/app.js
```

## Deploy to Railway

1. Connect your GitHub repo to Railway
2. Set Root Directory = `backend`
3. Add a PostgreSQL service
4. Set env vars (see `backend/.env.example`)
5. Run migrations via Railway Shell:
   ```
   node src/db/migrate.js && node seeds/seed.js
   ```

Full guide: [`RAILWAY.md`](./RAILWAY.md)

## Project Structure

```
backend/
  src/
    app.js           — Fastify entry point
    config/          — DB, Redis, env validation
    middleware/      — Auth, RBAC, CSRF, rate limit
    modules/        — Feature modules (auth, users, meetings, etc.)
    services/       — Email, audit, cron
    utils/          — Tokens, errors, helpers
    db/             — Migrations
  migrations/       — SQL migration files
  seeds/            — Admin + demo seed data
  tests/            — Jest integration tests
```

## API Docs

Base URL: `https://<your-app>.railway.app/api`

### Auth
- `POST /api/auth/login` — Login
- `POST /api/auth/register` — Register
- `POST /api/auth/refresh` — Refresh token

### Core
- `GET /api/meetings` — List meetings
- `GET /api/attendance` — View attendance
- `GET /api/ratings` — View ratings
- `GET /api/users` — User management
- `GET /api/team` — Team hierarchy

## Environment Variables

See [`backend/.env.example`](./backend/.env.example) for all required vars.

Key ones:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon Postgres connection string |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token |
| `RESEND_API_KEY` | Resend API key for emails |
| `JWT_SECRET` | JWT signing secret |
| `CORS_ORIGIN` | Frontend URL for CORS |

---

Built for the Quintern platform.
