# UX Audit: Page-to-Page Navigation, States, and Consistency

**Date:** 2026-02-05  
**Scope:** Whole site (root, Martin, project hubs). Aligned with [web design agent plan](.cursor/plans/web_design_agent_e8f0fbf0.plan.md) and [AGENT_HANDOFF](AGENT_HANDOFF.md) (navigation flow, UX/UI standards).

---

## 1. Page-to-page navigation

### 1.1 Global header (all pages)

| Page type | Brand (Zach Day) | Top nav (Projects, Writing, About, Contact) |
|-----------|------------------|---------------------------------------------|
| **Root** (`index.html`) | Not a link (plain div) | In-page anchors `#projects`, `#writing`, `#about`, `#contact` |
| **Martin & all others** | Link to home (`../index.html` or `../../index.html`) | Link to home + hash (`../index.html#projects` etc.) |

**Issue:** On the root page the brand is not clickable. Every other page uses the brand as “home.” For consistency and muscle memory, the root brand should also be a link (e.g. `href="./"` or `href="#top"`) so behavior is the same everywhere.

### 1.2 Martin section: hub vs deep pages

- **Martin hub** (`/martin/index.html`): Subnav pills (Overview, Origin, System, Plays, Innovations, Metrics, Standards, Roadmap) with `.active` on “Overview.” Good.
- **Section hubs** (e.g. `/martin/system/index.html`, `/martin/plays/index.html`, `/martin/origin/index.html`): Same subnav; `.active` on current section. Good.
- **Deep pages** (e.g. System child, Plays child):
  - **System** (`context.html`, `core-protocols.html`, etc.): “← Back to System” link to `./index.html` **and** full subnav. Good.
  - **Plays** (`champion-development.html`): “← Back to all plays” link to `./index.html`; **no subnav**. So from a play you can’t jump to Origin/System/etc. without going back to Plays first or using the top nav to home then Martin.
  - **Origin** (`problem.html`, `vision.html`, etc.): **No** “Back to Origin” link; subnav only. So Origin deep pages are consistent with the hub (subnav only), but System/Plays use a back link. Pattern is inconsistent.

**Recommendation:** Either:
- Add subnav to Plays deep pages (e.g. champion-development.html) so Martin section navigation is one click from any depth, or
- Add “← Back to Origin” to Origin deep pages and keep “back + subnav” for System and “back only” for Plays by design (document the pattern).

### 1.3 Project hubs (Micro-App Factory, Signal Engine, Personal OS)

- Brand and top nav point back to root (`../index.html`, `../index.html#projects`). No subnav (single-page hubs). Good.
- No “Back to projects” or “← Home” in content; users rely on header. Acceptable for shallow depth.

### 1.4 Breadcrumbs (per AGENT_HANDOFF)

- Handoff calls for “Consistent header with breadcrumbs (`Martin — [Section]`).”
- **Current:** H1 acts as breadcrumb (e.g. “Martin — Overview,” “Martin — System,” “Champion Development”). There is no separate breadcrumb trail (e.g. “Martin > Plays > Champion Development”).
- **Deep pages:** “Back to System” / “Back to all plays” provide parent context; no full path. For a doc-style site this is usually enough; a formal breadcrumb bar would be an enhancement.

---

## 2. Interactive states

### 2.1 Hover

- **Top nav links:** `color: var(--text)` on hover. Good.
- **Pills (subnav):** `border-color: var(--muted)`. Good.
- **Cards / card-links / play-cards:** `border-color: var(--muted)` (and on root index, card also gets `background: rgba(255,255,255,0.02)`). Good.
- **Buttons:** Primary and secondary have hover styles. Good.

### 2.2 Focus (keyboard / a11y)

- **Gap:** There are no `:focus` or `:focus-visible` styles in the codebase. Keyboard users get the browser default focus outline (or none if reset elsewhere), which can be low visibility or inconsistent.
- **Recommendation:** Add a visible focus style for interactive elements (nav links, pills, buttons, cards, “Back” links), e.g. `outline: 2px solid var(--accent); outline-offset: 2px` on `:focus-visible`, and avoid removing outline globally.

### 2.3 Active / current page

- **Subnav:** `.pill.active` is used for the current Martin section (background + border). Good.
- **Top nav:** No “current” state. On the root page, all four items are in-page anchors so “active” is ambiguous. On Martin or project pages, none of “Projects / Writing / About / Contact” are visually marked as current (e.g. you’re “in” a project but “Projects” doesn’t look selected). Optional improvement: add a class or use `aria-current="page"` for the relevant top-level item when on home vs project vs Martin and style it (e.g. muted or underlined).

---

## 3. Consistency summary

| Area | Status | Note |
|------|--------|------|
| Brand as home link | Inconsistent | Root: not a link. All others: link to home. |
| Back links on deep pages | Inconsistent | System: back + subnav. Plays: back, no subnav. Origin: no back, subnav only. |
| Subnav on Martin deep pages | Mixed | System children: subnav. Plays children: no subnav. Origin children: subnav. |
| Focus states | Missing | No :focus/:focus-visible. |
| Active top nav | Missing | No “you are here” for Projects/Writing/About/Contact. |
| Footer | Consistent | Same on all pages. |
| H1 as section title | Consistent | “Martin — [Section]” or page title. |

---

## 4. Recommendations (priority)

1. **High:** Add visible `:focus-visible` styles for all interactive elements (links, buttons, pills, cards) for accessibility.
2. **High:** Make the root page brand a link to `./` or `#` so “Zach Day” always means “go home” from every page.
3. **Medium:** Unify deep-page pattern in Martin: either add subnav to Plays deep pages (e.g. champion-development) so all Martin deep pages have subnav, or add “Back to Origin” to Origin deep pages and document the chosen pattern.
4. **Low:** Optionally indicate current top-level section (e.g. “Projects” when in any project or Martin) via class or `aria-current="page"` and subtle style.
5. **Low:** Consider a short breadcrumb trail on Martin deep pages (e.g. “Martin > Plays > Champion Development”) if you want to reinforce path without relying only on H1 + back link.

---

## 5. Files touched by recommendations

- **Root:** [index.html](../index.html) — brand wrap in `<a href="./">`, add focus styles in `<style>`.
- **Martin and project pages:** Add shared focus styles (could be duplicated in each file or moved to a shared CSS file later).
- **Plays deep page:** [martin/plays/champion-development.html](../martin/plays/champion-development.html) — optionally add subnav block.
- **Origin deep pages:** [martin/origin/problem.html](../martin/origin/problem.html), vision, architecture, impact — optionally add “← Back to Origin” link.

No backend or new frameworks; changes are HTML/CSS only, consistent with the current static setup and the web design agent scope.
