# GymFlow Web — Deployment Guide

This is the production-grade deployment runbook for **`saas-frontend`** (Next.js 16 App Router + React 19).

This is **not** a static site. It uses:

- App Router server components and route handlers (`app/api/auth/session`)
- `proxy.ts` (auth redirects for protected paths)
- `next start` / Vercel Node runtime (not `output: 'export'`)

| Environment    | Host                                  | Why this host                                         |
| -------------- | ------------------------------------- | ----------------------------------------------------- |
| Local          | `pnpm dev` → `http://localhost:3000`  | Talks to API on `:5000`                               |
| Staging / test | **Vercel Free**                       | Native Next.js, HTTPS, git deploys, env at build time |
| Production     | **AWS Amplify Hosting** (recommended) | SSR + CloudFront, git deploys, no fake-static S3      |

Related backend runbook: [`../saas-backend/README-DEPLOYMENT.md`](../saas-backend/README-DEPLOYMENT.md).

---

## Architecture recommendation (read this first)

### Why S3 + CloudFront is the wrong production default **for this repo**

S3+CloudFront is excellent for SPAs that `export` to HTML/JS. This app cannot:

- `next.config.ts` has no `output: 'export'`
- `proxy.ts` runs on the Edge/Node request path
- Session cookies are set by `app/api/auth/session/route.ts`
- `next start` is the production server (`package.json`)

If you put `out/` on S3, login, middleware, and `/api/auth/session` all break.

### Staging: Vercel

Vercel is the correct staging host: Next 16, `pnpm` lockfile, `NEXT_PUBLIC_*` baked at **build** time, preview URLs (CORS warning — see below).

### Production: AWS Amplify Hosting (recommended)

Amplify Hosting Compute (SSR) sits in front of CloudFront, builds Next.js, injects env, and supports a custom domain + ACM.

**Alternatives**

| Option                                     | Use when                                                                                                        |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Amplify Hosting                            | Default. Least ops, still AWS, still CDN.                                                                       |
| ECS Fargate + ALB + `output: 'standalone'` | You already run ECS for the API and want one compute pattern. Requires a Next.js Dockerfile we do not have yet. |
| Vercel Production                          | Allowed, but then production frontend is not on AWS.                                                            |
| S3 + CloudFront                            | Only after a deliberate migration off App Router middleware/API routes. **Do not do this now.**                 |

Production URL shape to aim for:

```
https://app.yourdomain.com     → Amplify (this app)
https://api.yourdomain.com     → ALB / ECS (Express)
```

---

## Prerequisites and tools

### Accounts

- GitHub repo dedicated to **`saas-frontend`** (Vercel and Amplify both deploy from git)
- Vercel account (Hobby is enough for staging)
- AWS account (production Amplify)
- The **staging API URL** from Render (Stage 1) before you set `NEXT_PUBLIC_API_URL`

### CLI tools

| Tool                  | Why                              |
| --------------------- | -------------------------------- |
| Node.js 20            | Next 16                          |
| pnpm                  | `pnpm-lock.yaml` is the lockfile |
| Git                   | Auto deploys                     |
| Vercel CLI (optional) | `npx vercel env pull`            |
| AWS CLI (production)  | Amplify domain / IAM             |

```powershell
node -v
pnpm -v
cd D:\ROAD-TO-12\saas-frontend
pnpm install
pnpm build
```

A local `pnpm build` catching TypeScript/runtime issues is cheaper than a failed Vercel build. Note: `next.config.ts` currently sets `typescript.ignoreBuildErrors: true`, so **a green Vercel build does not mean type-safe**. Still run `pnpm build` locally so webpack/runtime errors surface.

### IAM (Amplify production)

Amplify’s console-created service role is enough for Hosting. If you add GitHub Actions later, use OIDC (`AmplifyFullAccess` narrowed to one app). Do not put AWS access keys in Vercel.

---

## Concepts you will use

### `NEXT_PUBLIC_*` is compile-time

Anything prefixed `NEXT_PUBLIC_` is inlined into the **browser bundle at `next build`**. Changing the value on Vercel **requires a redeploy**. Server-only secrets must **not** use this prefix (this app does not need server secrets today except what Next sets itself).

Used today:

| Variable                    | Where                                          | Purpose                                                                                                                        |
| --------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_API_URL`       | `config/api.config.ts`, `lib/helpers/media.ts` | API origin **without** `/api/v1`. Axios uses `${NEXT_PUBLIC_API_URL}/api/v1`. Media URLs prefix this origin for `/uploads/...` |
| `NEXT_PUBLIC_APP_NAME`      | branding (if referenced)                       | Display name                                                                                                                   |
| `NEXT_PUBLIC_APP_URL`       | `.env*` templates                              | Canonical site URL                                                                                                             |
| `NEXT_PUBLIC_FRONTEND_URL`  | `config/api.config.ts` (`FRONTEND_URL`)        | Redirects / absolute links; falls back to `http://localhost:3000`                                                              |
| `NEXT_PUBLIC_BILLING_TRACE` | `lib/billing/trace.ts`                         | Optional; default on unless `'false'`                                                                                          |

### Cookies are split across two hosts

1. **Next.js** sets `accessToken` on **its own domain** (`app/api/auth/session`, `sameSite: 'lax'`). That is same-site and fine on Vercel.
2. **Express** sets HttpOnly `accessToken` / `refreshToken` on **the API domain** (`sameSite: 'strict'`). Axios uses `withCredentials: true` so the **refresh** call can send that cookie.

On `localhost` both are “site-adjacent” enough for Strict in some cases, but **Vercel → Render is cross-site**. Stage 2 will patch API cookies to `SameSite=None; Secure` before you rely on silent refresh.

### CORS is owned by the API

The browser origin is `https://<your-app>.vercel.app`. That exact string must be `FRONTEND_URL` on Render. Mismatch = browser blocks `/api/v1/*` even if curl works.

Vercel **Preview** deployments get unique origins. The API allowlist does not include them. For staging, use the **Production** Vercel deployment of the staging project, or turn off previews.

---

## Environment variables checklist

Templates live in `.env`, `.env.development`, `.env.production` (gitignored). Local override: `.env.local`.

| Variable                    | Local                   | Staging (Vercel)                                                             | Production (Amplify)         |
| --------------------------- | ----------------------- | ---------------------------------------------------------------------------- | ---------------------------- |
| `NEXT_PUBLIC_API_URL`       | `http://localhost:5000` | `https://gymflow-staging-api.onrender.com` (no `/api/v1`, no trailing slash) | `https://api.yourdomain.com` |
| `NEXT_PUBLIC_APP_URL`       | `http://localhost:3000` | `https://<project>.vercel.app`                                               | `https://app.yourdomain.com` |
| `NEXT_PUBLIC_FRONTEND_URL`  | `http://localhost:3000` | same as `NEXT_PUBLIC_APP_URL`                                                | same as prod app URL         |
| `NEXT_PUBLIC_APP_NAME`      | `Gym SaaS`              | `GymFlow Staging`                                                            | `GymFlow`                    |
| `NEXT_PUBLIC_BILLING_TRACE` | unset                   | `false` if noisy                                                             | `false`                      |

There is no `DATABASE_URL` on the frontend. All data goes through the API.

Stripe publishable keys: not currently required in this frontend env set (checkout is created by the API). If you add Stripe.js later, use `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (`pk_test_` on staging only).

---

## Staging setup (Vercel)

Do this **after** Stage 1: you need a live API URL.

### 1. GitHub repo

```powershell
cd D:\ROAD-TO-12\saas-frontend
git remote -v
```

Push `saas-frontend` to e.g. `github.com/<you>/gymflow-frontend`. Do not commit `.env*`.

### 2. Create the Vercel project

1. [vercel.com/new](https://vercel.com/new) → Import `gymflow-frontend`.
2. **Framework Preset:** Next.js (auto).
3. **Root Directory:** `.` (repo is the Next app).
4. **Install command:** `pnpm install`
5. **Build command:** `pnpm build` (Vercel default `next build` is equivalent).
6. **Output:** leave default (not `out/`).
7. **Node.js version:** `20.x` (Project Settings → General).

### 3. Environment variables (Production + Preview if you use previews)

In Vercel → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://<your-render-api>.onrender.com
NEXT_PUBLIC_APP_URL=https://<your-vercel-app>.vercel.app
NEXT_PUBLIC_FRONTEND_URL=https://<your-vercel-app>.vercel.app
NEXT_PUBLIC_APP_NAME=GymFlow Staging
```

If the Vercel URL is assigned **after** the first deploy, you will:

1. Deploy once to learn the URL
2. Set `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_FRONTEND_URL`
3. **Redeploy** (because they are public compile-time vars)
4. Set Render `FRONTEND_URL` to that same Vercel origin and **restart the API**

### 4. Automatic git deploys

Vercel Production deploys on push to the production branch (`main`). That is enough for staging if this Vercel project **is** staging. Optionally create a second Vercel project later for true production.

### 5. Pair CORS on the API

Render API env:

```
FRONTEND_URL=https://<your-vercel-app>.vercel.app
```

Must match the browser address bar **exactly**.

### 6. Verify staging frontend

1. Open `https://<your-vercel-app>.vercel.app`
2. DevTools → Network: login `POST` goes to `https://<render>/api/v1/auth/...` with status not `CORS error`
3. Hard refresh after API `FRONTEND_URL` change
4. Trainer/package images: URLs should start with the Render origin (`resolveMediaUrl`)

Local production-mode smoke (optional):

```powershell
$env:NEXT_PUBLIC_API_URL="https://<render>.onrender.com"
pnpm build
pnpm start
```

---

## Production setup (AWS Amplify Hosting)

### 1. Amplify app

AWS Console → Amplify → **Create app** → **GitHub** → select `gymflow-frontend`.

Build spec (Amplify can autodetect Next.js). If you need an explicit `amplify.yml`:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - corepack enable
        - corepack prepare pnpm@10.28.2 --activate
        - pnpm install --frozen-lockfile
    build:
      commands:
        - pnpm build
  artifacts:
    baseDirectory: .next
    files:
      - "**/*"
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

Platform: **Next.js - SSR** (not “Web (static)”).

### 2. Environment variables

Amplify → Hosting → Environment variables:

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com
NEXT_PUBLIC_FRONTEND_URL=https://app.yourdomain.com
NEXT_PUBLIC_APP_NAME=GymFlow
NODE_VERSION=20
```

Redeploy after any `NEXT_PUBLIC_*` change.

### 3. Domain, TLS, DNS

1. Amplify → Domain management → add `app.yourdomain.com`
2. Amplify requests ACM and gives Route 53 CNAMEs / alias — apply them
3. Wait until HTTPS is issued (often 15–30 minutes)
4. Confirm `https://app.yourdomain.com` (not the `*.amplifyapp.com` default) is what you put in API `FRONTEND_URL`

### 4. If you insist on ECS instead of Amplify

You must add `output: 'standalone'` to `next.config.ts` and a `Dockerfile` that runs `node server.js`. Then put ECS behind an ALB + ACM + Route 53, same as the API. That is more moving parts for no benefit until you have a platform team. Prefer Amplify.

---

## CORS and domain pairing

| Env     | Browser origin               | `NEXT_PUBLIC_API_URL`        | API `FRONTEND_URL`           |
| ------- | ---------------------------- | ---------------------------- | ---------------------------- |
| Local   | `http://localhost:3000`      | `http://localhost:5000`      | `http://localhost:3000`      |
| Staging | `https://x.vercel.app`       | `https://y.onrender.com`     | `https://x.vercel.app`       |
| Prod    | `https://app.yourdomain.com` | `https://api.yourdomain.com` | `https://app.yourdomain.com` |

Checklist when login fails in the browser:

1. Network tab: is the request OPTIONS then POST, or a red CORS error?
2. Response `Access-Control-Allow-Origin` must equal the page origin, not `*`
3. `NEXT_PUBLIC_API_URL` must **not** include `/api/v1` (the client appends it)
4. Media 404s: `NEXT_PUBLIC_API_URL` wrong, or file stored on Render disk that already recycled

---

## CI/CD (GitHub Actions)

Vercel already builds on git push. Add a **typecheck/lint gate** so broken PRs never reach staging:

```yaml
# .github/workflows/ci.yml  (in gymflow-frontend)
name: ci
on:
  pull_request:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10.28.2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        env:
          NEXT_PUBLIC_API_URL: http://localhost:5000
          NEXT_PUBLIC_APP_URL: http://localhost:3000
          NEXT_PUBLIC_FRONTEND_URL: http://localhost:3000
          NEXT_PUBLIC_APP_NAME: GymFlow CI
```

Production Amplify: enable **PR previews** only if you also expand API CORS. Otherwise, deploy production from `main` only.

Optional promote-to-prod workflow: `workflow_dispatch` that calls Amplify `start-job` on the prod branch after a human approval environment.

---

## Verification and troubleshooting

### What “good” looks like

- Vercel deploy: Ready, HTTPS
- Home page loads, no console CORS on `/api/v1/health` (if you call it)
- Login: `201/200` from Render, then Next `/api/auth/session` `200`
- After idle Render sleep: first click slow, second click normal

### Common failures

**Build failed: lockfile / pnpm**
Set Install Command to `corepack enable && corepack prepare pnpm@10.28.2 --activate && pnpm install --frozen-lockfile`.

**Blank env in browser**
`NEXT_PUBLIC_API_URL` was added **after** the build. Redeploy. Confirm in Sources that the bundle is not still `localhost:5000`.

**CORS**
API `FRONTEND_URL` stale. Preview URL used. Trailing slash.

**401 after login**
API cookies `SameSite=Strict` on cross-site staging. Patch the API (Stage 2) or check that Axios still stores the access token in memory (`setAccessToken`) — first paint can work until refresh.

**Images broken**
`resolveMediaUrl` prefixes `NEXT_PUBLIC_API_URL`. If that still points at localhost in a production bundle, rebuild. If it points at Render but files were local uploads, they are gone after recycle.

**`pnpm build` OOM on Amplify**
Increase Amplify compute, or set `NODE_OPTIONS=--max-old-space-size=4096`.

**Middleware redirect loops**
`proxy.ts` treats missing/expired JWT as login redirect. If `accessToken` cookie is `Secure` on HTTP local prod (`pnpm start` without TLS), session route cookies may not stick. Staging/prod HTTPS is fine.

**Wrong API path 404**
`NEXT_PUBLIC_API_URL` accidentally includes `/api/v1`, producing `/api/v1/api/v1/...`.

---

## Stage map (mentor-led)

1. Stage 1 — Staging backend (Render)
2. **Stage 2 — Staging frontend (Vercel)** ← after Stage 1 is verified
3. Stage 3 — AWS production backend
4. Stage 4 — AWS production frontend (Amplify)
5. Stage 5 — GitHub Actions
