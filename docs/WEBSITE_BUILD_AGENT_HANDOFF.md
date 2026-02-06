# Website Build Agent Handoff — ZachDay-Site (Martin v3)

**Repo:** `zachday-site` (static site)  
**Goal:** Produce a clean, coherent “Martin” section + supporting project pages that read like a tight product narrative, are fast, and are easy to extend.

---

## 1) What “good” looks like (taste + constraints)

### Taste
- Minimal, calm, high-contrast dark UI
- Clear hierarchy (one strong H1, short subcopy, scannable cards)
- Low ornamentation; “quiet confidence”
- Navigation is consistent across pages (same header/footer patterns)

### Constraints
- Static HTML (Cloudflare Pages, no framework assumptions)
- Keep pages lightweight: avoid heavy JS; prefer CSS + simple DOM scripts
- No internal/customer data leaks (see Sanitization Rules below)

---

## 2) Current repo structure (source of truth)

**Root**
- `index.html` — homepage (projects + writing + about + contact)
- `docs/` — internal docs for build/design rules + PRDs
- `martin/` — published Martin section (current)
- `src/` — source templates/assets (if used); can be used to regenerate `/martin` pages
- Other projects: `micro-app-factory/`, `personal-os/`, `signal-engine/`

**Key observation:** You currently have **two Martin trees**:
- `martin/` (the published site pages)
- `src/martin/` (a source/stub structure with shared CSS/JS under `src/`)

Decide one of these approaches:
1) **Direct-edit published** (`/martin` is canonical) — simplest, fewer moving parts
2) **Source-driven** (`/src` is canonical) — build agent updates `/src/*` and copies/exports to `/martin/*`

Recommendation: **Source-driven** if you want consistent styling and long-term scale; otherwise **direct-edit** if you want minimal maintenance.

---

## 3) Information architecture (what pages should exist)

### Homepage
- Keep as-is. Swap placeholder project links (`href="#"`) to real pages.

### Projects (top-level)
- `/martin/` — flagship project
- `/micro-app-factory/`
- `/signal-engine/`
- `/personal-os/`

### Martin section (recommended nav)
- `/martin/index.html` — landing
- `/martin/origin/` — the why + origin story
- `/martin/system/` — how it works (architecture + protocols + validation)
- `/martin/plays/` — play ecosystem + examples
- `/martin/innovations/` — key innovations
- `/martin/metrics/` — performance + impact
- `/martin/roadmap/` — what’s next
- `/martin/standards/` — principles/standards (optional if redundant)

Goal: Each page answers one question. Avoid “everything everywhere.”

---

## 4) PRD outputs you’re expected to generate (and where they land)

### PRD 2 — Build Log
**Output:** `prd-2-build-log-martin-v3.md`  
**Website placement:** `/martin/origin/` (or a dedicated `/martin/build-log/`)  
**Purpose:** version narrative (v1→v3), architectural milestones, key pivots, evidence-driven story

### PRD 3 — Play Ecosystem
**Output:** `prd-3-play-ecosystem-martin-v3.md` fileciteturn1file0L66-L68  
**Website placement:** `/martin/plays/`  
**Must include (artifacts):**
- Play catalog table (17 plays)
- Use case matrix (15+ scenarios)
- 4–5 sanitized case studies (context → execution → outcome) fileciteturn1file0L31-L39
- Output format overview (HTML / Sheets / Text) fileciteturn1file13L41-L87
- Validation framework (14 blocking rules) fileciteturn1file13L1-L36

### PRD 4 — Intelligence Layer
**Output:** `prd-4-intelligence-layer-martin-v3.md` fileciteturn1file6L26-L35  
**Website placement:** `/martin/metrics/` (or `/martin/intelligence/`)  
**Must include:**
- Risk signal dictionary (5 categories, 40+ signals) fileciteturn1file6L34-L41
- Scoring algorithm (formula + multipliers + tiering) fileciteturn1file10L57-L62
- Signal → playbook mapping using the 4-step framework (Validate/Strategize/Engage/Mitigate) fileciteturn1file9L43-L47
- Proactive vs reactive comparison + impact metrics fileciteturn1file10L19-L38
- Risk history tracking (stateful queries) + Runner Agent monitoring fileciteturn1file6L46-L52

### PRD 5 — Collaboration Story
**Output:** `prd-5-collaboration-story-martin-v3.md` fileciteturn1file4L3-L6  
**Website placement:** `/martin/origin/` (or `/martin/collaboration/`)  
**Must include:**
- 4 phases (Discovery → Prototyping → Production → Evolution) fileciteturn1file4L11-L24
- 5 learnings + 5 pivots (with evidence) fileciteturn1file2L7-L17
- 6–8 sanitized quotes with context fileciteturn1file2L11-L18
- Patterns + evolution metrics + future roadmap fileciteturn1file3L7-L18
- Voice: first-person plural (“We discovered…”) fileciteturn1file3L27-L33

---

## 5) Site-wide build rules

### Navigation consistency
- Every Martin page should share:
  - same top nav items (Origin / System / Plays / Innovations / Metrics / Roadmap)
  - same footer
  - same max-width container

### Typography + spacing
- Use a shared typographic scale and spacing tokens (do not freestyle per page)
- Keep copy tight: short paragraphs, bullet lists, and “callouts” for key claims

### Cross-linking
- End each page with:
  - “Next” link (linear reading path)
  - “Related” links (2–3 pages max)

---

## 6) Sanitization rules (non-negotiable)

Apply a sanitization pass before anything goes live:
- Replace account/customer names with `[Account A]`, `[Enterprise Customer]`, etc.
- Replace collaborator names with `[Technical Collaborator A]`, etc.
- Remove internal URLs (Slack, Confluence, Sheets IDs), replace with `[Internal Link]`
- Replace exact ACV/financials with ranges
- Keep version numbers, architecture patterns, generic metrics (time saved, token reduction), and non-sensitive tools.

(These are explicitly called out in PRD 3/4/5 and must be enforced.) fileciteturn1file0L49-L55 fileciteturn1file6L9-L15 fileciteturn1file4L93-L104

---

## 7) Acceptance checklist (what you ship)

### UX / taste
- [ ] Homepage project cards all link to real pages (no `href="#"`)
- [ ] Martin pages feel like a single product microsite (consistent layout + nav)
- [ ] Each page has one clear job; no bloated “kitchen sink” sections

### Content integrity
- [ ] PRD 2/3/4/5 outputs exist as markdown and are reflected on site
- [ ] PRD 3 includes 4–5 execution examples with context→execution→outcome fileciteturn1file0L31-L39
- [ ] PRD 4 includes scoring + tiers + example calculation fileciteturn1file6L37-L39
- [ ] PRD 5 includes pivots + learnings + quotes (anonymized) fileciteturn1file4L42-L70

### Safety
- [ ] No customer names, no internal links, no employee names (except author if desired)
- [ ] No secrets/keys/IDs
- [ ] No proprietary database/schema names in published code blocks

---

## 8) Immediate fixes / quick wins (do these first)

1) **Replace placeholder Contact**
- Update `mailto:you@domain.com` to your real email (or remove until ready).

2) **Wire homepage project links**
- `Micro-App Factory` → `/micro-app-factory/`
- `Signal Engine` → `/signal-engine/`
- `Personal OS` → `/personal-os/`

3) **Add a Martin sub-nav**
- On `/martin/index.html`, add a “Start here” route that guides readers:
  - Origin → System → Plays → Intelligence/Metrics → Roadmap

---

## 9) Deliverables to hand back (what I expect from you)

- Updated site pages committed (static HTML)
- `prd-2-build-log-martin-v3.md`
- `prd-3-play-ecosystem-martin-v3.md` fileciteturn1file0L66-L68
- `prd-4-intelligence-layer-martin-v3.md` fileciteturn1file6L26-L29
- `prd-5-collaboration-story-martin-v3.md` fileciteturn1file4L3-L6
- A short `CHANGELOG.md` summarizing what changed in the site structure and why

---

## 10) Notes on your current homepage (index.html)

Your homepage has strong taste: simple grid, minimal cards, clean type, good spacing. The only thing holding it back right now is **unfinished wiring** (placeholder links + placeholder contact). Once those are real, it reads like a real product studio landing page.

