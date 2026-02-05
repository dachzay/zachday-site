# Design Agent Context

Stored principles and reference URLs from the web design agent. Update this when the agent extracts patterns from frontier sites so taste stays consistent across sessions.

---

## Reference URLs (this run)

- **cursor.com** — Hero with one bold headline, single primary CTA (Download), large hero image, minimal nav (Sign in, Download, menu). Light theme, lots of whitespace.
- **vercel.com** — Hero with headline + short subtext, two CTAs (primary solid black “Start Deploying”, secondary outlined “Get a Demo”), category chips/tabs below hero, subtle grid background, abstract gradient graphic. Light theme, strong hierarchy.

---

## Design principles extracted (Cursor + Vercel)

1. **One clear hero message** — One headline + one short supporting line; primary CTA directly under. No competing headlines in the hero.
2. **Primary CTA is obvious** — Single main button (Cursor) or one dominant + one secondary (Vercel). Buttons are high-contrast (solid or outlined), rounded, with clear label.
3. **Generous whitespace** — Space above/below hero and between sections. Content width constrained (e.g. max-width) so lines don’t stretch.
4. **Section labels are subtle** — Section titles are small, uppercase or muted so content (cards, copy) carries the weight.
5. **Nav is minimal** — Few top-level links; secondary actions (e.g. “Download”, “Sign in”) are clearly styled.

---

## zachday.xyz vs Cursor/Vercel (quick comparison)

| Aspect            | zachday.xyz now                    | Cursor / Vercel pattern                    |
|------------------|-------------------------------------|--------------------------------------------|
| Theme            | Dark (on-brand)                     | Cursor/Vercel use light; your dark is fine |
| Hero             | H1 + paragraph + 2 CTAs             | Same idea; they tighten subtext length     |
| Primary CTA      | “View projects →” (white btn)       | One dominant CTA; you already have this   |
| Section titles   | “FEATURED PROJECTS” (uppercase, muted)| Same pattern (subtle section labels)      |
| Cards            | Bordered, 2-col grid, tags           | Similar card + tag pattern                 |
| Nav              | Projects, Writing, About, Contact    | Minimal; you’re already minimal            |
| Max width        | `min(800px, 92vw)`                  | Similar constrained width                  |

---

## Summary of potential changes (realistic, no stretch)

These stay within your current stack (static HTML/CSS, existing tokens) and don’t require new tech or full redesigns.

1. **Tighten hero subtext**  
   Shorten the line under “I build practical AI systems…” to one short sentence (e.g. 8–12 words). Keeps hierarchy clear like Cursor/Vercel.

2. **Single primary CTA in hero**  
   Make “View projects →” the only hero CTA (or clearly primary). Move “Contact” to nav or below the fold so the hero has one clear action.

3. **Slightly more space around hero**  
   Increase top/bottom padding on the hero block (e.g. +24px or +32px) so it feels more “hero” and less cramped.

4. **Section spacing**  
   Add a bit more margin-top to “Featured projects” (and any other sections) so section labels feel more separated from the hero.

5. **Button styling**  
   Ensure primary button has a bit more padding (e.g. 12px 20px) and consistent border-radius (e.g. 6px or 8px) so it reads as the main CTA.

6. **Optional: subtle background**  
   Very light pattern or gradient behind the hero only (e.g. subtle grid or noise) to add depth without changing your dark palette. Skip if you prefer pure flat.

7. **Card hover**  
   You already have border hover; optionally add a very subtle transition on background (e.g. `background: rgba(255,255,255,0.02)` on hover) for a bit more feedback.

8. **Footer**  
   Keep as-is; Cursor/Vercel-style footers are dense with links. Your simpler footer is appropriate for a personal site.

---

## What we’re not changing (by design)

- No switch to a light theme; your dark theme is part of your brand.
- No new frameworks or build step; changes are HTML/CSS only.
- No heavy motion or animations; only small transition tweaks if you want.
- No restructuring of pages; only refinements to spacing, copy length, and CTA emphasis.

If you want to implement any of these, say which numbers (e.g. “apply 1, 2, and 3”) and we can turn them into concrete edits in `index.html` and any shared CSS.
