# Website Handoff (Monolith)

Date: 2026-02-09
Repo: `zachday-site`
Primary Branch: `main`
Deployment: Cloudflare Pages via `npm run deploy`

## 1) Current Intent and Product Framing

The site has shifted from action-oriented UX to interpretive showcase UX.

Core intent:
- Present Zach's judgment, taste, and execution philosophy through artifacts.
- Optimize for interpretation clarity, not user conversion.

Non-goals:
- No onboarding flows.
- No funnels or "start here" patterns.
- No directive CTA language that tells users what to do.

## 2) Recent Release Scope

This pass implemented a full interpretive content layer without changing layout architecture.

Implemented:
- Home framing sentence to set interpretive expectations.
- Pilot and then full-pass "Why this matters" statements across flagship pages.
- Martin section pages now include concise "Interpretive Evidence" bullets.
- Martin overview includes a "Key Exhibits" curation block.
- Live social feed section configured to X timeline with 1-post limit.
- Global visual system retained (dark theme, sticky header behavior, card interactions).

## 3) Files Updated in the Full Pass

Primary content pass:
- `martin/index.html`
- `martin/origin/index.html`
- `martin/system/index.html`
- `martin/plays/index.html`
- `martin/innovations/index.html`
- `martin/metrics/index.html`
- `martin/standards/index.html`
- `micro-app-factory/index.html`
- `signal-engine/index.html`
- `personal-os/index.html`

Supporting home/feed and prior UX updates already in main:
- `index.html`

## 4) Deployed Commits (Relevant)

- `601f0a3`: remove wrangler temp files and ignore `.wrangler/tmp/`
- `c7d9358`: add interpretive framing pass across project pages

Status:
- `main` pushed to `origin/main`
- `npm run deploy` executed successfully after latest push
- Cloudflare Pages expected to auto-publish from repo integration

## 5) Content System Now in Place

### Home page
- Hero includes a global framing sentence:
  - site should be read as artifacts for interpretation, not instruction.
- "Writing" renamed to "Live Feed".
- X embed active for `@dachzay` with `data-tweet-limit="1"`.

### Martin overview
- Includes project-level curatorial line:
  - "Why this matters" statement under hero.
- Includes "Key Exhibits" links to core Martin sections.

### Martin section pages
The following pages now include interpretive framing blocks:
- Origin
- System
- Plays
- Innovations
- Metrics
- Standards

Pattern used:
- 1 short "Why this matters" sentence near hero.
- 1 concise "Interpretive Evidence" list tied to the section's role.

### Non-Martin project pages
- `micro-app-factory/index.html`
- `signal-engine/index.html`
- `personal-os/index.html`

Each includes one short curatorial statement to clarify why the artifact exists in Zach's body of work.

## 6) UX/Interaction Baseline

Shared baseline currently active across pages:
- Dark token set and minimalist visual language.
- Sticky translucent header with scroll-state border (`header.scrolled`).
- Pulsing green status dot in brand.
- Card hover lift + shine effect.
- Global link color override to avoid browser default blue links.
- "Back to Home" wayfinding on subpages.

## 7) Known Constraints and Risks

1. X timeline freshness
- X embed can cache and may appear stale.
- Current mitigation: `data-tweet-limit="1"`.
- If strict "latest" accuracy is required, embed a specific tweet URL or use API-backed rendering.

2. Inline CSS duplication
- Many pages carry duplicated style blocks.
- This is workable now but increases maintenance cost.
- Future refactor option: extract shared CSS into a single static stylesheet.

3. Content consistency across deeper Martin child pages
- Full interpretive pass was applied to main Martin section hubs.
- Some deep child pages can still be further aligned if desired.

## 8) Operational Commands

Local preview:
- `npm run dev`

Deploy:
- `npm run deploy`

Git push:
- `git push origin main`

## 9) Suggested Next Iteration (Optional)

If continuing this direction, next practical increment:
1. Add the same interpretive micro-pattern to deep Martin child pages.
2. Standardize section-level evidence phrasing for tighter editorial voice.
3. Replace placeholder contact links on home with live links.
4. Consolidate duplicated CSS into shared static file.

## 10) Quick Audit Checklist for Future Agent

- Verify each section keeps interpretation-over-instruction tone.
- Verify no page reintroduces onboarding/funnel language.
- Verify each flagship page has exactly one curatorial sentence.
- Verify evidence bullets stay concise and non-promotional.
- Verify X embed still renders and honors post limit.
- Verify no accidental `.wrangler/tmp` tracking in git.

## 11) Handoff Summary

This site is now positioned as an interpretive portfolio layer, not a guided product tour. The current release establishes consistent curatorial framing across home, Martin section hubs, and supporting project pages, and is deployed from `main`.
