# Upstash · Free Redis for Quintern

Upstash provides serverless Redis. Quintern uses the **REST API**
(not TCP), so it works on serverless platforms, edge runtimes, and
behind restrictive firewalls.

Free tier:

- 10,000 commands/day
- 256 MB storage
- 1 database
- Global replication
- TLS

**$0/month forever.**

## Setup (1 minute)

1. Go to [upstash.com](https://upstash.com) → Sign in with GitHub
2. **Create Database** → name `quintern` → region **US East** (or closest to backend)
3. Click the database → **REST API** section
4. Copy:
   - `UPSTASH_REDIS_REST_URL` (e.g. `https://apn1-xxx.upstash.io`)
   - `UPSTASH_REDIS_REST_TOKEN`
5. Paste both into your backend's environment

That's it. The Quintern backend auto-detects Upstash REST and uses it
for rate limiting, sessions, and CSRF token storage. No code changes
needed.

## Why Upstash REST

- **Works on serverless** — no TCP, just HTTPS
- **Works on Render free tier** — no need to provision a Redis container
- **Free tier is generous** — 10k cmd/day = 5 cmd/minute, more than
  enough for a small app

If you need more: Pro tier is $0.20 per 100k commands, with no daily
limit. Still essentially free for low traffic.

## What Quintern stores in Redis

- CSRF tokens (short-lived, 1 hour)
- Rate limit counters (rolling window)
- Refresh token blacklist (on logout)
- Session metadata (last login, device fingerprint)

All of this is **optional** — if `UPSTASH_REDIS_REST_URL` is not set,
the backend falls back to in-memory storage (works fine for single-
instance deployments, just doesn't scale horizontally).
