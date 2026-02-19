# Website Handoff (Commercial V2 + Concierge Scope Intake)

Date: 2026-02-18
Repo: `zachday-site`
Primary Branch: `main`
Remote: `origin` -> `https://github.com/dachzay/zachday-site.git`
Deployment: Cloudflare Pages (production from `main`)

## 1) Current Product Direction

The commercial funnel has been upgraded to a "Level Up" release across the 5 commercial pages with stronger visual proof and a guided AI scoping path.

Current intent:
- Capture qualified inbound consulting opportunities.
- Demonstrate execution capability above the fold (functional proof, not only claims).
- Route high-intent visitors through guided scope intake or direct lead form.
- Keep static-site architecture (HTML/CSS/JS + Cloudflare Pages Functions + D1).

Current non-goals:
- No JS framework migration.
- No CMS introduction.
- No freeform LLM chat in v1 concierge (guided deterministic flow only).

## 2) What Changed Since The Last Handoff

### Major release (2026-02-18)
- Commercial visual system refreshed across:
  - `/`
  - `/services/`
  - `/case-studies/`
  - `/process/`
  - `/faq/`
- Shared style/system introduced: `shared/css/commercial-v2.css`.
- Shared header/year/presence behavior introduced: `shared/js/commercial-common.js`.
- Homepage hero demo introduced: `shared/js/hero-demo.js`.
- Guided AI concierge introduced: `shared/js/concierge.js`.
- New backend endpoint introduced: `functions/api/concierge-scope.js`.
- D1 migration added for `concierge_scopes`: `ops/migrations/2026-02-18-add-concierge-scopes.sql`.
- GA4/GTM tracking documentation updated for concierge and hero demo.
- Concierge API contract documented in `docs/concierge_scope_api.md`.

### Previous release context (2026-02-16)
- Services-first homepage pivot.
- `/api/leads` hardened and Turnstile-enabled lead forms.
- Ops scripts for health checks/backup/webhook secret rotation.

## 3) Latest Relevant Commits

- `a944e03` (2026-02-18): commercial v2 rollout + concierge API + migration + docs
- `880ccfc` (2026-02-16): lead form + ops script/docs updates
- `3f50672` (2026-02-16): Turnstile enabled on lead forms + docs
- `1a4fc87` (2026-02-16): services-first refactor + secure `/api/leads`
- `492d51e` (2026-02-10): signal-engine narrative refactor

## 4) Current Site Map

Commercial pages (in scope for V2):
- `/index.html` (hero demo + AI concierge + direct lead form)
- `/services/index.html` (services + proof ribbon + direct lead form)
- `/case-studies/index.html` (bento proof cards with before/after visuals)
- `/process/index.html` (delivery model + proof ribbon)
- `/faq/index.html` (FAQ + proof ribbon)

Project/proof pages (still live):
- `/martin/*`
- `/micro-app-factory/`
- `/signal-engine/`
- `/personal-os/`

Backend/API:
- `/api/leads` via `functions/api/leads.js`
- `/api/concierge-scope` via `functions/api/concierge-scope.js`

## 5) Lead + Concierge Capture Architecture

### A) Lead form path (`/api/leads`)
Front-end forms:
- `index.html` form id: `consult-form`
- `services/index.html` form id: `lead-form`

Shared fields:
- `name`, `email`, `employee_band`, `website` (honeypot), `source_path`, `turnstile_token`

### B) Concierge path (`/api/concierge-scope`)
Front-end module:
- `shared/js/concierge.js`
- finite-state guided flow:
  1. `business_type`
  2. `primary_bottleneck`
  3. `current_tools`
  4. `timeline`
  5. `budget_band`
  6. `contact` (`name`, `email`, `employee_band`, optional `notes`)

Concierge payload includes:
- `session_id`, `source_path`
- contact + scope fields
- `transcript` array (`role: user|assistant`, `text`)
- `turnstile_token`

### C) Security/validation patterns
Both endpoints enforce:
- JSON content type
- request size limits
- same-origin checks
- field normalization/validation
- optional Turnstile verification when `TURNSTILE_SECRET` is present
- optional rate limiting (`LEADS_RATE_LIMITER`; concierge also supports `CONCIERGE_RATE_LIMITER`)

## 6) Data Layer / D1 Schema

Existing table:
- `leads`

New table:
- `concierge_scopes` (via migration)

Migration file:
- `ops/migrations/2026-02-18-add-concierge-scopes.sql`

Apply command:
```powershell
npx wrangler d1 execute LEADS-DB --remote --file .\ops\migrations\2026-02-18-add-concierge-scopes.sql
```

## 7) Runtime Configuration

Required:
- `LEADS_DB` (D1 binding)

Recommended:
- `TURNSTILE_SECRET`
- `LEADS_RATE_LIMITER`
- `CONCIERGE_RATE_LIMITER` (optional; falls back to `LEADS_RATE_LIMITER`)

Optional forwarding:
- `GOOGLE_SHEETS_WEBHOOK_URL` or `LEADS_WEBHOOK_URL`
- `LEADS_WEBHOOK_SECRET`

Testing fallback only:
- `ALLOW_SIMULATED_LEADS=true`

## 8) Tracking / Analytics

Tracking docs:
- `docs/ga4_gtm_setup.md`

New emitted events:
- `concierge_open`
- `concierge_step_complete`
- `concierge_submit_attempt`
- `concierge_submit_success`
- `concierge_submit_error`
- `hero_demo_start`
- `hero_demo_complete`

Existing lead events remain:
- `lead_form_start`
- `lead_form_submit_attempt`
- `lead_form_submit_success`
- `lead_form_submit_error`

## 9) Ops Automation

NPM scripts:
- `npm run ops:health`
- `npm run ops:backup`
- `npm run ops:rotate:webhook -- --apply`
- `npm run ops:maintenance`

Script files:
- `scripts/ops/health-check.js`
- `scripts/ops/backup-d1.js`
- `scripts/ops/rotate-webhook-secret.js`

## 10) Current Risks / Constraints

1. Deploy script stages too broadly
- `npm run deploy` uses `git add -A`.
- It can commit unrelated local files (already observed once).

2. GTM not enabled by default
- Commercial pages still have `<meta name="gtm-id" content="">`.
- Analytics events emit to dataLayer, but GTM loading requires setting the real ID.

3. Wrangler local warning
- `wrangler pages dev` warns no explicit `compatibility_date` set.
- Non-blocking but should be set in Wrangler config for consistency.

4. Cloudflare auth requirement for non-interactive commands
- D1 migration/backup commands need `CLOUDFLARE_API_TOKEN` in non-interactive environments.

## 11) Validation Snapshot (2026-02-18)

Completed checks:
- `node --check functions/api/concierge-scope.js` (pass)
- `node --check shared/js/concierge.js` (pass)
- `npm run ops:health` (pass)
- local smoke:
  - `GET /`, `/services/`, `/case-studies/`, `/process/`, `/faq/` -> `200`
  - `OPTIONS /api/leads` -> `204`
  - `OPTIONS /api/concierge-scope` -> `204`
  - invalid concierge POST returns `422` as expected

## 12) Quick Checklist For Next Agent

- Confirm D1 migration applied in target environment.
- Confirm concierge submissions persist into `concierge_scopes`.
- Confirm lead forms still persist into `leads`.
- If webhook enabled, confirm `event_type: concierge_scope` payload reaches destination.
- Set real GTM ID and validate all new event mappings in GTM Preview + GA4 DebugView.
- Decide whether to harden deploy flow to avoid `git add -A` surprises.

## 13) Handoff Summary

As of 2026-02-18, the commercial funnel is upgraded to a shared V2 system with kinetic typography, hero execution proof, visual bento case studies, and guided AI concierge scoping backed by a new Pages Function and D1 table migration.
