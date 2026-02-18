# Concierge Scope API

Date: 2026-02-18
Endpoint: `POST /api/concierge-scope`

## Purpose

Accept a structured scope intake from the homepage AI Concierge, persist it to D1, and optionally forward it to the existing webhook destination.

## Request JSON

```json
{
  "session_id": "string<=64",
  "source_path": "string<=120, starts with /",
  "name": "string<=80",
  "email": "valid email<=254",
  "employee_band": "0-5|5-10|11-25|26-50|51-100|101-250|251+",
  "business_type": "string<=80",
  "primary_bottleneck": "string<=160",
  "current_tools": "string<=240",
  "timeline": "string<=40",
  "budget_band": "string<=40",
  "notes": "string<=1000",
  "transcript": [
    { "role": "user|assistant", "text": "string<=500" }
  ],
  "turnstile_token": "string<=4096"
}
```

## Responses

Success:
```json
{ "ok": true, "scope_id": 123, "forwarded": true }
```

Error:
```json
{ "error": "message" }
```

Status codes:
- `200`: stored successfully
- `400`: invalid payload
- `403`: origin or Turnstile verification failure
- `413`: payload too large
- `415`: unsupported content type
- `422`: invalid fields
- `429`: rate limited
- `503`: persistence unavailable

## Data Storage

Table: `concierge_scopes`
Migration: `ops/migrations/2026-02-18-add-concierge-scopes.sql`

## Webhook Forwarding

Uses existing environment variables:
- `GOOGLE_SHEETS_WEBHOOK_URL` or `LEADS_WEBHOOK_URL`
- `LEADS_WEBHOOK_SECRET`

Forwarded payload includes `event_type: "concierge_scope"` plus all normalized fields and `scope_id`.
