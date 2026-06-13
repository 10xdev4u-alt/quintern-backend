# Neon · Free Postgres for Quintern

Neon is the Postgres provider for Quintern. The free tier gives:

- 0.5 GB storage
- 191.9 compute hours/month (enough for a 24/7 hobby project)
- 1 project, 10 branches
- Auto-suspend after 5 min inactivity (wakes in ~500ms on next query)
- Point-in-time recovery up to 7 days

**$0/month forever.**

## Setup (2 minutes)

1. Go to [neon.tech](https://neon.tech) → Sign in with GitHub
2. **New Project** → name `quintern` → region **AWS US East** (or closest to your backend)
3. Copy the **connection string** from the dashboard:
   ```
   postgresql://neondb_owner:<password>@ep-xxx.us-east-2.aws.neon.tech/quintern?sslmode=require
   ```
4. Paste it as `DATABASE_URL` in your backend's environment (Render, Fly, etc.)

## Branching (optional, but powerful)

Neon lets you branch your database like Git. This means:

- `main` branch = your production database
- `preview` branch = automatic per-PR database (Vercel/Render preview deploys)
- `dev` branch = local development

Cost: still $0 on the free tier (counts toward the 0.5 GB limit).

## Migrations

The Quintern backend auto-runs migrations on startup if the env var
`AUTO_MIGRATE=true` is set (default). Or run manually:

```bash
DATABASE_URL="<your-neon-url>" node backend/src/db/migrate.js
DATABASE_URL="<your-neon-url>" node backend/seeds/seed.js
```

## Why Neon over Render Postgres

Render's managed Postgres is free for 90 days, then $7/month. Neon is
free forever on the 0.5 GB tier. Quintern's schema is small (< 10 MB
with seed data), so 0.5 GB is plenty for years.
