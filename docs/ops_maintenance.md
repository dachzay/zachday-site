# Ops Maintenance Runbook

This runbook covers recurring operations for lead capture reliability:
- health checks
- D1 backups with retention
- webhook secret rotation

## Prerequisites

1. Wrangler authenticated:
- `npx wrangler login`
2. Cloudflare Pages project name known (default in scripts: `zachday-site`).
3. D1 database name known (default in scripts: `LEADS-DB`).

Set these in your shell before running:

```powershell
$env:CF_PAGES_PROJECT_NAME = "zachday-site"
$env:LEADS_DB_NAME = "LEADS-DB"
```

## Commands

Health check (endpoint + D1 query):

```powershell
npm run ops:health
```

If your local machine has a TLS chain issue, you can temporarily bypass certificate validation for this script:

```powershell
$env:LEADS_HEALTH_SKIP_TLS_VERIFY = "true"
npm run ops:health
```

Backup D1 and prune old backups:

```powershell
npm run ops:backup
```

Backup dry-run (no Cloudflare call, validates local backup pipeline):

```powershell
npm run ops:backup -- --dry-run
```

Equivalent env toggle:

```powershell
$env:LEADS_BACKUP_DRY_RUN = "true"
npm run ops:backup
```

Run both:

```powershell
npm run ops:maintenance
```

Rotate webhook secret in Cloudflare Pages:

```powershell
npm run ops:rotate:webhook -- --apply
```

After rotation, update Apps Script script property `LEADS_WEBHOOK_SECRET` to the printed value.

## Suggested Schedule

- Daily 2:00 AM local: `npm run ops:backup`
- Weekly Monday 8:00 AM local: `npm run ops:health`
- Monthly (first business day): `npm run ops:rotate:webhook -- --apply`

## Windows Task Scheduler (example)

Daily backup task:

```powershell
schtasks /Create /TN "Leads-D1-Backup" /SC DAILY /ST 02:00 /TR "powershell -NoProfile -Command `"cd C:\Users\ZachDay\Desktop\website; `$env:LEADS_DB_NAME='LEADS-DB'; npm run ops:backup`"" /F
```

Weekly health task:

```powershell
schtasks /Create /TN "Leads-Health-Check" /SC WEEKLY /D MON /ST 08:00 /TR "powershell -NoProfile -Command `"cd C:\Users\ZachDay\Desktop\website; `$env:LEADS_DB_NAME='LEADS-DB'; npm run ops:health`"" /F
```

## Backups and Rotation Logs

- Backups write to `ops/backups` and are gzip-compressed (`.sql.gz`).
- A metadata file (`.meta.json`) is written with size and SHA-256 hash.
- Secret rotations append log lines to `ops/secret-rotation.log` with hashed secret material only.

## Restore Drill (manual)

1. Pick a backup from `ops/backups/*.sql.gz`.
2. Decompress:
- `gzip -dk <backup-file.sql.gz>` (or use any zip utility)
3. Restore to D1:

```powershell
npx wrangler d1 execute LEADS-DB --remote --file .\ops\backups\<backup-file.sql>
```

4. Run:
- `npm run ops:health`

## HITL Steps You Still Own

1. Apps Script sync after webhook secret rotation:
- Update script property `LEADS_WEBHOOK_SECRET`.
2. Turnstile secret rotation:
- Rotate in Cloudflare Turnstile dashboard, then set new `TURNSTILE_SECRET` in Pages.
3. Periodic restore drill:
- Run at least once per month to verify backups are usable.
