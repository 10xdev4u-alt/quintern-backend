# Vercel · Quintern Frontend

The Quintern frontend is a Vite-built SPA (React 18). Vercel is the
canonical host for Vite apps — auto-detected, zero config, free tier
unlimited, global CDN, custom domain free.

## One-click deploy

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `rajat-wyrm/Quintern` from GitHub
3. Set **Root Directory** = `frontend`
4. Set **Environment Variable**:
   - `VITE_API_BASE` = `https://quintern-api.onrender.com/api`
5. Click **Deploy**

That's it. Vercel will:

- Auto-detect Vite
- Run `npm ci` and `npm run build` (paths from `vercel.json`)
- Deploy `frontend/dist` to its edge CDN
- Give you a URL like `https://quintern-<hash>.vercel.app`
- Auto-deploy on every push to `main`

## Why this works

`vercel.json` in the repo root configures:

- `framework: "vite"` — Vercel auto-installs Node + Vite
- `buildCommand: "cd frontend && npm run build"`
- `outputDirectory: "frontend/dist"`
- `installCommand: "cd frontend && npm ci"`
- SPA rewrites: all routes → `/index.html` (so React Router works)
- Long cache on `/assets/*` (Vite-hashed filenames = safe to cache)
- Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
- Build-time env: `VITE_API_BASE` baked into the bundle

If you set **Root Directory** = `frontend` in the Vercel dashboard,
Vercel will chdir there before running the build commands, and
`vercel.json` will be read from that subdirectory. You can also place
`vercel.json` inside `frontend/` and skip the Root Directory setting.

## Custom domain (free)

Vercel → Project → Settings → Domains → Add `quintern.app` (or any
domain you own). Free SSL via Let's Encrypt. DNS auto-configured if
you use Vercel nameservers, or one CNAME if you don't.

## Cost

$0/month on Vercel free tier:

- 100 GB bandwidth/month
- 6,000 build minutes/month
- Unlimited sites
- Free SSL
- Free custom domain

## After deploy

Update the backend's `CORS_ORIGIN` env var on Render to allow your
Vercel URL, e.g. `https://quintern.vercel.app`.
