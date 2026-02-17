# GA4 + GTM Setup (Lead Funnel Tracking)

Date: 2026-02-17

This site already emits form funnel events through `window.dataLayer` via `shared/js/tracking.js` and `shared/js/lead-form.js`.

## Event names already emitted

- `lead_form_start`
- `lead_form_submit_attempt`
- `lead_form_submit_success`
- `lead_form_submit_error`

## Event parameters available

- `context` (for example: `home`, `services`)
- `form_id` (for example: `consult-form`, `lead-form`)
- `source_path` (page path where submit happened)
- `path`
- `timestamp`
- `status` and `message` on error events (when available)

## GTM container setup

Code wiring in this repo:

- `shared/js/gtm-loader.js` loads GTM only when a valid `GTM-XXXXXXX` ID is present.
- Commercial pages include `<meta name="gtm-id" content="">` and load `shared/js/gtm-loader.js`.
- Set the `content` value to your real container ID on pages where you want GTM active.

1. Create or open your GTM Web container.
2. Add one `GA4 Configuration` tag with your Measurement ID and trigger `All Pages`.
3. Create `Custom Event` triggers for:
   - `lead_form_start`
   - `lead_form_submit_attempt`
   - `lead_form_submit_success`
   - `lead_form_submit_error`
4. For each trigger, create a matching `GA4 Event` tag.
5. In each GA4 Event tag, map event parameters:
   - `context` -> `{{DLV - context}}`
   - `form_id` -> `{{DLV - form_id}}`
   - `source_path` -> `{{DLV - source_path}}`

## GTM variables to add

Create Data Layer Variables:

- `DLV - context` (`context`)
- `DLV - form_id` (`form_id`)
- `DLV - source_path` (`source_path`)
- `DLV - status` (`status`) optional
- `DLV - message` (`message`) optional

## GA4 configuration

1. In GA4 Admin, create custom dimensions:
   - `context` (Event scope)
   - `form_id` (Event scope)
   - `source_path` (Event scope)
2. Mark `lead_form_submit_success` as a conversion.

## KPI reporting configuration

Primary KPI:
- Weekly count of `lead_form_submit_success` by `source_path`
- Conversion rate: page views to `lead_form_submit_success`

Secondary KPI (manual follow-up model):
- Track booked calls in your ops workflow and reconcile weekly by `source_path`.

## QA checklist

1. Open GTM Preview mode and submit a test form on `/`.
2. Confirm all expected events fire in order.
3. Submit a test form on `/services/`.
4. Confirm `context`, `form_id`, and `source_path` are populated.
5. Confirm GA4 DebugView receives events.
