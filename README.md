# Martin Personal Website

A Stripe-quality personal operating system and portfolio site.

## Tech Stack
- HTML5
- CSS3 (Variables, Grid, Flexbox)
- Vanilla JavaScript
- Cloudflare Pages (or Netlify/Vercel)

## Development
- No build step: the repo is static HTML/CSS.
- Local preview (Cloudflare Pages dev): `npm run dev` then open `http://localhost:8788`.
- First-time setup for Cloudflare CLI: `npx wrangler login`.

## Lead Capture API (`/api/leads`)

This repo includes a Cloudflare Pages Function at `functions/api/leads.js`.

Required binding:
- `LEADS_DB` (D1 database)

Recommended bindings:
- `TURNSTILE_SECRET` (Workers secret; enables server-side Turnstile verification)
- `LEADS_RATE_LIMITER` (Workers rate limiting binding)

Optional lead mirror destination:
- `GOOGLE_SHEETS_WEBHOOK_URL` (Apps Script web app URL)
- `LEADS_WEBHOOK_SECRET` (shared secret used by Worker + Apps Script)

D1 schema:

```sql
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  employee_band TEXT NOT NULL,
  source_path TEXT NOT NULL,
  created_at TEXT NOT NULL
);
```

Notes:
- Form endpoints now POST JSON to `/api/leads` from `index.html` and `services/index.html`.
- `ALLOW_SIMULATED_LEADS=true` can be used only for local simulation when no DB binding exists.
- Set Turnstile site key in both pages: `<meta name="turnstile-site-key" content="...">`.
- Google Sheets webhook + automation guide: `docs/google_sheets_lead_webhook.md`.

## Deploy (one command)

```bash
npm run deploy
```

This stages all changes, commits with message `deploy: update site`, and pushes. **Cloudflare Pages** is connected to **dachzay/zachday-site** and deploys **production from `main`**. Preview locally with `npm run dev` before pushing to `main`.

### Repo

- **GitHub**: [dachzay/zachday-site](https://github.com/dachzay/zachday-site)
- Cloudflare Pages is connected; push = deploy.
