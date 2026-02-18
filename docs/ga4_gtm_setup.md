# GA4 + GTM Setup (Lead + Concierge Funnel Tracking)

Date: 2026-02-18

This site emits funnel and interaction events through `window.dataLayer` via `shared/js/tracking.js`, `shared/js/lead-form.js`, `shared/js/concierge.js`, and `shared/js/hero-demo.js`.

## Event names emitted

Lead form events:
- `lead_form_start`
- `lead_form_submit_attempt`
- `lead_form_submit_success`
- `lead_form_submit_error`

Concierge and hero proof events:
- `concierge_open`
- `concierge_step_complete`
- `concierge_submit_attempt`
- `concierge_submit_success`
- `concierge_submit_error`
- `hero_demo_start`
- `hero_demo_complete`

## Event parameters available

Core fields:
- `context` (`home`, `services`, `case_studies`, `process`, `faq`)
- `source_path` (page path where action happened)
- `path`
- `timestamp`

Lead fields:
- `form_id` (for example: `consult-form`, `lead-form`)

Concierge fields:
- `session_id`
- `step_id` on `concierge_step_complete`
- `status` on error events when available

## GTM container setup

Code wiring in this repo:
- `shared/js/gtm-loader.js` loads GTM only when a valid `GTM-XXXXXXX` ID is present.
- Commercial pages include `<meta name="gtm-id" content="">` and load `shared/js/gtm-loader.js`.

1. Create or open your GTM Web container.
2. Add one `GA4 Configuration` tag with your Measurement ID and trigger `All Pages`.
3. Create `Custom Event` triggers for all events listed above.
4. For each trigger, create a matching `GA4 Event` tag.
5. Map event parameters in GA4 tags:
   - `context` -> `{{DLV - context}}`
   - `source_path` -> `{{DLV - source_path}}`
   - `form_id` -> `{{DLV - form_id}}`
   - `session_id` -> `{{DLV - session_id}}`
   - `step_id` -> `{{DLV - step_id}}`

## GTM variables to add

Create Data Layer Variables:
- `DLV - context` (`context`)
- `DLV - source_path` (`source_path`)
- `DLV - form_id` (`form_id`)
- `DLV - session_id` (`session_id`)
- `DLV - step_id` (`step_id`)
- `DLV - status` (`status`) optional
- `DLV - message` (`message`) optional

## GA4 configuration

1. In GA4 Admin, create custom dimensions:
   - `context` (Event scope)
   - `source_path` (Event scope)
   - `form_id` (Event scope)
   - `session_id` (Event scope)
   - `step_id` (Event scope)
2. Mark conversions:
   - `lead_form_submit_success`
   - `concierge_submit_success`

## KPI reporting configuration

Primary KPIs:
- Weekly `lead_form_submit_success` by `source_path`
- Weekly `concierge_submit_success` by `source_path`
- Concierge completion rate: `concierge_submit_success / concierge_open`

Secondary KPIs:
- Step drop-off by `step_id`
- Hero demo engagement: `hero_demo_complete / hero_demo_start`

## QA checklist

1. Open GTM Preview mode and load `/`.
2. Confirm `concierge_open` fires once.
3. Complete one concierge step and confirm `concierge_step_complete` includes `step_id`.
4. Submit concierge flow and confirm `concierge_submit_attempt` then `concierge_submit_success`.
5. Submit lead form on `/` and `/services/` and confirm existing lead events still fire.
6. Confirm `hero_demo_start` and `hero_demo_complete` fire on homepage.
7. Confirm GA4 DebugView receives all expected events with populated params.
