# Render · Quintern Backend

The Quintern backend is a Fastify API. Render's Blueprint feature lets
us define the entire infrastructure (web service, static site) in a
declarative `render.yaml` checked into the repo, so deploys are
reproducible and one-click.

## One-click deploy

1. Go to [render.com](https://render.com) → Sign in with GitHub
2. **New** → **Blueprint**
3. Connect `rajat-wyrm/Quintern` repo
4. Render detects `render.yaml` and shows the plan:
   - `quintern-api` (web service, Docker, free)
   - `quintern-web` (static site, free)
5. Click **Apply**

Render will:

- Build the backend from `backend/Dockerfile`
- Build the frontend from `frontend/` (Vite)
- Generate 4 random secrets automatically (`JWT_ACCESS_SECRET`,
  `JWT_REFRESH_SECRET`, `CSRF_SECRET`, `API_KEY`)
- Deploy both with HTTPS + auto-deploy on every push to `main`

## Env vars to set manually

After first deploy, open the `quintern-api` service → Environment and
add:

| Key                        | Where to get it                                                   |
| -------------------------- | ----------------------------------------------------------------- |
| `DATABASE_URL`             | neon.tech → project → connection string (with `?sslmode=require`) |
| `UPSTASH_REDIS_REST_URL`   | upstash.com → Redis database → REST API                           |
| `UPSTASH_REDIS_REST_TOKEN` | upstash.com → Redis database → REST API                           |
| `GROQ_API_KEY`             | console.groq.com → API keys (free)                                |
| `GEMINI_API_KEY`           | aistudio.google.com → API key (free)                              |
| `CORS_ORIGIN`              | Your Vercel frontend URL, e.g. `https://quintern.vercel.app`      |
| `APP_URL`                  | Your Render backend URL, e.g. `https://quintern-api.onrender.com` |

That's it. Render auto-restarts the service when env vars change.

## Custom domain

Free on Render. Service → Settings → Custom Domain → Add
`api.quintern.app` (or any domain you own). Free SSL via Let's Encrypt.

## Cost

$0/month on Render free tier:

- 750 hours/month of web service time
- 100 GB outbound bandwidth
- Free SSL
- Free custom domain

**Caveat**: Free web services **sleep after 15 minutes of inactivity**.
The next request takes ~30 seconds to cold-start. For a demo or
portfolio this is fine. For always-on at $7/month, upgrade to the
Starter plan (no sleep, custom domains still free, more resources).

## After deploy

```bash
# Verify health
curl https://quintern-api.onrender.com/health
# → {"status":"ok","db":"connected","redis":"connected"}

# Verify ready (migrations ran)
curl https://quintern-api.onrender.com/api/ready
# → {"status":"ready","checks":{"db":true,"migrations":true}}

# Seed the database (only needed once)
# Open the service → Shell → run:
cd backend && node seeds/seed.js
```

The seed creates the default admin user:

- **email**: `admin@internops.com`
- **password**: `Admin@123`

**Change this password immediately** on first login via the UI.
