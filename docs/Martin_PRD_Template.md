# Product Requirements Document: Martin Website Design System
**Version**: 1.0 (DRAFT)  
**Status**: Ready for Stakeholder Review  
**Last Updated**: January 20, 2026

---

## 1. Executive Overview

### 1.1 Purpose
This PRD formalizes the visual architecture, user experience, and information structure for the "Martin" personal operating system website—a documentation and reference site organized into distinct domain layers (System, Plays, Innovations, Metrics, Standards, Roadmap).

### 1.2 Scope
- **In Scope**: Design system tokens, component library, information architecture, navigation flows, page templates, responsive strategy, accessibility compliance
- **Out of Scope**: Backend APIs, database schema, content management implementation, dynamic data loading (these are referenced as content only)

### 1.3 Success Criteria
- ✅ All pages follow consistent design tokens (color, spacing, typography)
- ✅ Navigation is intuitive on mobile, tablet, and desktop
- ✅ Information hierarchy makes the Martin system's structure visible and navigable
- ✅ WCAG 2.1 Level AA accessibility compliance
- ✅ Page load time < 2 seconds (on 4G)
- ✅ Touch targets minimum 44x44px on mobile

---

## 2. Design System

### 2.1 Color Tokens

**Primary Palette**

| Token | Value | Usage | WCAG Contrast |
|-------|-------|-------|---------------|
| `--bg` | `#0a0a0a` | Page background | — |
| `--panel` | `#161616` | Card/panel background | — |
| `--text` | `#e8eaf0` | Primary text | 18.6:1 ✅ |
| `--muted` | `#999999` | Secondary text | 4.5:1 ✅ |
| `--border` | `#262626` | Borders, dividers | — |
| `--accent` | `#10b981` | Status indicators, (TBD: active states?) | 8.2:1 ✅ |

**Usage Rules**
- `--text` for body, headings, primary labels
- `--muted` for metadata, captions, inactive states
- `--accent` currently used only for status dot; PRD to expand to active navigation and link hover states
- `--border` for all 1px dividers, card borders
- No color should be removed without stakeholder approval

**Future Consideration**: 
- Should there be error/warning/success semantic colors? (e.g., `--error: #ef4444`, `--success: #10b981`)
- Define currently (set to N/A for future milestone)

---

### 2.2 Typography System

**Font Stack**
```css
font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
```
✓ Modern system fonts, no external loads (performance benefit)  
✓ No decorative fonts or serif faces (maintain professional/technical aesthetic)

**Type Scale**

| Usage | Size | Weight | Line-Height | Letter-Spacing |
|-------|------|--------|-------------|-----------------|
| **H1 (Page Title)** | `clamp(32px, 5vw, 48px)` | 700 | 1.1 | -0.8px |
| **H2 (Section Label)** | `14px` | 600 | 1.0 | 1px |
| **H3 (Card Title)** | `16px` | 600 | 1.2 | 0px |
| **Body Text** | `16px` | 400 | 1.5 | 0px |
| **Small Text (Meta)** | `14px` | 400 | 1.5 | 0px |
| **UI Labels (Buttons)** | `14px` | 500 | 1.0 | 0px |
| **Tiny (Pills)** | `12px` | 500 | 1.0 | 0px |

**Notes**
- H1 uses `clamp()` for responsive scaling (no media query needed)
- All other sizes are fixed (no scaling)
- **Line-height additions needed**: currently inconsistent (1.5, 1.6). PR should enforce this scale.
- Letter-spacing is ad-hoc; standardize across type scale

**Action for PRD Finalization**:
- [ ] Decide: Should body text scale on tablet/mobile, or stay fixed at 16px?
- [ ] Confirm uppercase labels should always use 1px letter-spacing

---

### 2.3 Spacing Scale

**Standardized increments** (8px base):

| Token | Value | Usage |
|-------|-------|-------|
| `sp-2` | `4px` | Tight spacing (pill padding, small gaps) |
| `sp-3` | `8px` | Compact (pill gaps, button padding) |
| `sp-4` | `12px` | Small (padding inside cards) |
| `sp-6` | `16px` | Default (margins, padding, gaps) |
| `sp-8` | `24px` | Large (section spacing, card padding) |
| `sp-12` | `32px` | Extra large (major sections) |
| `sp-16` | `48px` | Hero spacing, top margin |
| `sp-20` | `64px` | Footer, bottom padding |
| `sp-24` | `96px` | Page bottom padding |

**Current Implementation**:
- ✅ Uses consistent multiples (8, 16, 24, 32, 48, 64, 96)
- ✗ Not yet defined in CSS custom properties
- **Action**: Convert to `--sp-*` tokens in `:root`

---

### 2.4 Border & Radius

**Border Radius**
```
--radius-xs: 4px   (pills, small elements)
--radius-sm: 6px   (buttons)
--radius-md: 8px   (cards, main containers)
```

**Border Widths**
```
--border-thin: 1px (cards, dividers)
--border-bold: 2px (emphasis, active states) — TBD
```

**Current State**:
- ✅ Consistent use of 8px for cards, 6px for buttons, 4px for pills
- ✓ Logical hierarchy
- ✗ Not yet tokenized

---

### 2.5 Shadows & Elevation

**Shadow System** (currently only one defined)

| Level | CSS | Usage |
|-------|-----|-------|
| **Elevation 0** | `none` | Flat surfaces (cards default) |
| **Elevation 1** | `0 4px 12px rgba(0, 0, 0, 0.4)` | Hover states, overlays (defined but unused) |
| **Elevation 2** | TBD | Modals, dropdowns |
| **Elevation 3** | TBD | Maximum (floating actions) |

**Action**: Define all three levels or confirm shadows aren't needed for this design

---

## 3. Component Library

### 3.1 Buttons

**Primary Button**
- **Background**: `#ffffff` (white)
- **Text**: `#000000` (black)
- **Padding**: `10px 18px`
- **Border**: `1px solid #ffffff`
- **Radius**: `6px`
- **State: Hover**: `background: #e5e5e5; border-color: #e5e5e5`
- **State: Focus**: `:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px }` ← **ADD**
- **State: Disabled**: `opacity: 0.5; cursor: not-allowed` ← **ADD**
- **State: Active/Pressed**: `transform: scale(0.98)` ← **ADD**

**Secondary Button**
- **Background**: `transparent`
- **Text**: `var(--text)`
- **Border**: `1px solid var(--border)`
- **Padding**: `10px 18px`
- **Radius**: `6px`
- **State: Hover**: `border-color: var(--muted); background: rgba(255, 255, 255, 0.03)`
- **State: Focus**: `:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px }` ← **ADD**
- **State: Disabled**: `opacity: 0.5; cursor: not-allowed` ← **ADD**

**Missing State Documentation**:
- [ ] Loading state (spinner icon? text change?)
- [ ] Error state (red border? icon?)
- [ ] Success state (green border? checkmark?)

---

### 3.2 Links

**Currently Three Link Patterns** (should consolidate to one):

**Pattern A: Text Link** (footer, meta)
```css
color: var(--text);
text-decoration: underline;
text-decoration-color: var(--border);
```

**Pattern B: Card CTA** (inside cards)
```css
.card-cta {
  color: var(--text);
  text-decoration: underline;
  text-decoration-color: var(--border);
  font-weight: 500;
  transition: text-decoration-color 0.15s;
}
.card:hover .card-cta {
  text-decoration-color: var(--text);
}
```

**Pattern C: Button Link** (hero CTA)
```html
<a class="btn primary" href="#projects">View projects →</a>
```

**Recommendation for PRD**:
Consolidate to a unified link system:
```css
a {
  color: var(--text);
  text-decoration: underline;
  text-decoration-color: var(--accent);
  text-underline-offset: 4px;
  transition: text-decoration-color 0.15s;
}

a:hover {
  text-decoration-color: var(--text);
}

a:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

---

### 3.3 Cards

**Container**
- **Background**: `transparent` (or `var(--panel)` if stacking depth needed)
- **Border**: `1px solid var(--border)`
- **Border-radius**: `8px`
- **Padding**: `24px`
- **Grid Span**: `6` (2-column on desktop, 12 on mobile)

**Interactive States**
- **Hover**: `border-color: var(--muted)` (brightens border)
- **Focus**: ← **ADD** (if card is clickable via `.card` as `<a>`)
- **Active**: ← **ADD** (if used as tab/selection)

**Content Hierarchy Inside Card**
```
H3 (Title)        16px, 600 weight
p.meta (desc)     14px, --muted, 1.5 line-height
spacer 16px
.pillrow          tags
spacer 24px
.card-cta         underlined text (optional)
```

**Unused**: `.shadow` property suggests shadow was planned but not used

---

### 3.4 Pills (Tags)

**Styling**
- **Font Size**: `12px`
- **Padding**: `4px 10px`
- **Border**: `1px solid var(--border)`
- **Background**: `transparent`
- **Border-radius**: `4px`
- **Weight**: `500`
- **Color**: `var(--text)`
- **Hover**: None defined ← **ADD** if clickable

**Current Usage**: Non-interactive labels on cards  
**Question for PRD**: Should pills be clickable to filter by tag?

---

### 3.5 Navigation Components

**Header Navigation** (needs redesign for complexity)
- Current: `<nav> <a> links</a> </nav>` (horizontal, simple)
- Issue: Doesn't scale to 10+ items
- PRD Must Specify: Breadcrumbs, sidebar menu, mobile hamburger, tab bar—choose one model

**Missing Components** (for Martin subsystem):
- [ ] **Breadcrumb**: `Martin > System > Rules`
- [ ] **Sidebar Navigation**: Hierarchical list of sections/subsections
- [ ] **Hamburger Menu**: Mobile navigation toggle
- [ ] **Tab Bar** or **Pill Nav**: For mobile section selection
- [ ] **Search Bar** (if needed)
- [ ] **Active State Indicator**: How to show current page in nav

---

### 3.6 Status Indicators

**Current Implementation**: Green dot in header
```html
<span class="dot" title="Currently building"></span>
```
- **Size**: `8px` diameter
- **Color**: `#10b981`
- **Shape**: `border-radius: 999px` (perfect circle)
- **Accessibility Issue**: `title` attribute not enough; needs `aria-label`

**Suggestion for PRD**:
Add semantic states:
```css
.status--active    { background: #10b981; } /* Building */
.status--complete  { background: #3b82f6; } /* Done */
.status--planned   { background: #6b7280; } /* Planned */
.status--archived  { background: #4b5563; } /* Old */
```

---

### 3.7 Layout Components

**Container**
```css
width: min(800px, 92vw);
margin: 0 auto;
```
✓ Constrains max-width to 800px  
✓ Allows mobile breathing room (92vw)

**Grid**
```css
display: grid;
grid-template-columns: repeat(12, 1fr);
gap: 24px;
```
✓ 12-column grid (flexible for 1, 2, 3, 4, 6, 12 spans)  
✓ 24px gap (consistent spacing)

---

## 4. Navigation Architecture

### 4.1 Current State (Landing Page)
```
Header: "Zach Day" [dot] | [Projects] [Writing] [About] [Contact]
├─ Hero section
├─ Featured projects (includes link to martin/index.html)
├─ Writing (stub)
├─ About (stub)
├─ Contact (stub)
└─ Footer
```

### 4.2 Expected Martin Subsystem Structure

**From Handoff**:
```
/martin/
├── index.html          (Overview page)
├── system/
│   ├── index.html      (System overview)
│   ├── rules.html      (Rule documentation)
│   ├── context.html    (Context definition)
│   └── protocols.html  (Protocol docs)
├── plays/
│   ├── index.html      (Plays listing)
│   ├── champion-development.html
│   ├── [other plays]
│   └── ...
├── innovations/        (Stubbed)
├── metrics/            (Stubbed)
├── standards/          (Stubbed)
└── roadmap/            (Stubbed)
```

### 4.3 Navigation Model Decision ← **STAKEHOLDER INPUT REQUIRED**

**Option A: Left Sidebar (Desktop) + Hamburger (Mobile)**

*Desktop View*:
```
┌─────────────────────────────────────────────────────────┐
│ Martin                                              [⚙]  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ├─ System                        │ Content area         │
│  │  ├─ Rules                      │ (main column)        │
│  │  ├─ Context                    │                      │
│  │  └─ Protocols                  │                      │
│  ├─ Plays                         │                      │
│  │  ├─ Champion Dev.              │                      │
│  │  └─ [Others]                   │                      │
│  ├─ Innovations                   │                      │
│  ├─ Metrics                       │                      │
│  ├─ Standards                     │                      │
│  └─ Roadmap                       │                      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

*Mobile View*:
```
┌─────────────────────────┐
│ Martin        [☰ Menu]  │
├─────────────────────────┤
│                         │
│ Content area            │
│ (full width)            │
│                         │
│ [Menu pops from left]   │
```

**Pros**: 
- Shows full hierarchy
- Easy to navigate related sections
- Persistent context

**Cons**: 
- Takes up 20-30% of desktop width
- Sidebar might feel overwhelming
- Content area squeezed on smaller screens

---

**Option B: Top Tab Bar (Sections) + Sidebar (Subsections)**

*Desktop View*:
```
┌──────────────────────────────────────────────────────┐
│ Martin > [System] [Plays] [Innovations] [Metrics]... │
├──────────────────────────────────────────────────────┤
│                                                      │
│ ├─ Rules        │ Content area                       │
│ ├─ Context      │ (main column)                      │
│ └─ Protocols    │                                    │
│                                                      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

*Mobile View*:
```
┌──────────────────────────┐
│ Martin > System ▼        │
├──────────────────────────┤
│ [Rules] [Context]        │ (scrollable pills)
│ [Protocols]              │
├──────────────────────────┤
│ Content area             │
```

**Pros**:
- Cleaner header
- Tabs reinforce sections
- Scales well to mobile

**Cons**:
- Can't see full hierarchy at once
- Requires more clicks to navigate

---

**Option C: Breadcrumb + Modal Menu**

*Desktop View*:
```
┌────────────────────────────────────────────────────┐
│ [≡] Martin > System > Rules | Search...          │
├────────────────────────────────────────────────────┤
│ Content area                                       │
│ (full width)                                       │
│                                                    │
│ [Menu icon opens drawer]                          │
```

*Mobile View*:
```
┌────────────────────────┐
│ [≡] M > System > Rules │
├────────────────────────┤
│ Content area           │
│                        │
│ [Drawer slides in from left when [≡] clicked]
```

**Pros**:
- Maximizes content space
- Works great on mobile
- Lightweight

**Cons**:
- Breadcrumb can get long
- Menu hidden until clicked
- Less discoverable navigation

---

**PRD Recommendation**: **Option B (Tab Bar + Sidebar)**
- Best balance of discoverability and screen real estate
- Scales gracefully to mobile with scrollable pills
- Clearer mental model of hierarchy

**ACTION**: Stakeholder to confirm choice

---

### 4.4 Breadcrumb Component (Specification)

**When to Show**: On all Martin subsystem pages except `/martin/index.html`

**Format**:
```html
<nav class="breadcrumb" aria-label="Breadcrumb">
  <a href="/martin/index.html">Martin</a>
  <span aria-current="page">System</span>
  <span>Rules</span>
</nav>
```

**Styling**:
- **Separator**: ` > ` (text, not icon)
- **Color**: Last item (current page) = `var(--text)`, others = `var(--muted)`
- **Size**: `14px`
- **Spacing**: Between separators 8px

---

### 4.5 Active State Indicator

**For Sidebar Items**:
- Current page item gets `border-left: 2px solid var(--accent)` + `background: rgba(16, 185, 129, 0.1)`
- Text changes from `var(--muted)` to `var(--text)`

**For Tab Bar Items**:
- Active tab: `border-bottom: 2px solid var(--accent)`
- Inactive: `border-bottom: 1px solid transparent`

---

## 5. Page Templates

### 5.1 Martin Homepage (`/martin/index.html`)

**Purpose**: Introduction to the Martin system, entry point

**Content Sections**:
1. **Hero**
   - Title: "Martin" (or "Martin System" if needed disambiguation)
   - Subtitle: What is Martin? (1-2 sentence summary)
   - CTA buttons: "Explore System", "View Plays"

2. **System Overview** (Card Grid)
   - Title: "The Kernel"
   - 3-4 cards showing: Rules, Context, Protocols, [optional]

3. **Plays Overview** (Carousel or Card Grid)
   - Title: "Workflows & Plays"
   - Show 3-5 featured plays with cards

4. **Other Sections** (Stub Cards)
   - Innovations, Metrics, Standards, Roadmap
   - Each shows "Coming soon" or preview

**Layout**: Single-column, full-width content

---

### 5.2 System Page Template (`/martin/system/index.html`)

**Purpose**: Overview of all system components (Rules, Context, Protocols)

**Content Sections**:
1. **Page Header**
   - Title: "System"
   - Subtitle: Explanation of what the system is
   - Breadcrumb: `Martin > System`

2. **Section Cards** (3-column grid)
   - Rules
   - Context
   - Protocols
   
   Each card shows:
   - Icon (optional)
   - Title
   - 1-2 line description
   - "Explore" link

---

### 5.3 System Detail Template (`/martin/system/rules.html`)

**Purpose**: Deep dive into one system component

**Content Structure**:
1. **Page Header**
   - Breadcrumb: `Martin > System > Rules`
   - Title: "System Rules"
   - Metadata: Last updated, status (draft/published)

2. **Table of Contents** (optional, for long pages)
   - Sticky on desktop, collapsed on mobile

3. **Content Area** (Markdown-friendly)
   - H2 sections
   - Prose paragraphs
   - Optional: Code blocks, lists, tables

4. **Related Links** (footer)
   - "See also: Context", "See also: Protocols"
   - "Back to System"

---

### 5.4 Plays Listing Template (`/martin/plays/index.html`)

**Purpose**: Show all workflows/plays

**Content Structure**:
1. **Page Header**
   - Breadcrumb: `Martin > Plays`
   - Title: "Plays"
   - Subtitle: What are plays?

2. **Play Cards** (2-column grid, full-width on mobile)
   Each card:
   - Play name (H3)
   - Brief description (meta text)
   - Tags/pills (e.g., "Process", "Ops")
   - "Explore" link

3. **Optional Filtering**
   - Filter by tag (if plays are tagged)
   - Sort by date/name/category

---

### 5.5 Play Detail Template (`/martin/plays/champion-development.html`)

**Purpose**: Document one specific play/workflow

**Content Structure**:
1. **Page Header**
   - Breadcrumb: `Martin > Plays > Champion Development`
   - Title: "Champion Development"
   - Metadata: Category, frequency, status

2. **Overview Section**
   - What is this play?
   - When to use it?
   - Typical duration?

3. **Steps/Phases** (Numbered list or cards)
   - Step 1: [Description]
   - Step 2: [Description]
   - Step 3: [Description]
   - etc.

4. **Tools/Outputs**
   - What do you use? (tools, templates)
   - What do you produce? (outputs, artifacts)

5. **Related Plays**
   - "Often paired with: [Play X]"
   - "Next step: [Play Y]"

---

### 5.6 Stub/Coming Soon Template

**Purpose**: Placeholder for incomplete sections (Innovations, Metrics, etc.)

**Content**:
```
┌─────────────────────────────────────┐
│ Innovations                         │
├─────────────────────────────────────┤
│ Coming soon                         │
│ This section is under development.  │
│ [Optional: Placeholder illustration]│
└─────────────────────────────────────┘
```

**Styling**:
- Centered, mid-page positioning
- Muted text color (`var(--muted)`)
- Optional: Loading animation or icon
- Call-to-action: "Check back soon" or "Get notified"

---

## 6. Responsive Design Strategy

### 6.1 Breakpoints

```
Mobile:   320px - 639px   (phones, small tablets)
Tablet:   640px - 1023px  (iPad portrait, large phones landscape)
Desktop:  1024px+         (iPad landscape, desktop)
```

### 6.2 Layout Changes by Breakpoint

**Mobile (< 640px)**
- Container: `width: 92vw; max-width: 100%;`
- Grid cards: `grid-column: span 12;` (full-width)
- Sidebar navigation: Hidden, opens as drawer
- Breadcrumb: Single-line, may truncate with ellipsis

**Tablet (640px - 1023px)**
- Container: `width: 90vw;`
- Grid cards: `grid-column: span 6;` (2-column layout)
- Sidebar: Optional (may be hidden or condensed)

**Desktop (1024px+)**
- Container: `width: min(1200px, 92vw);`
- Grid cards: `grid-column: span 6;` or `span 4;` (2-3 columns)
- Sidebar: Persistent, 250-300px wide

### 6.3 Navigation Responsive Behavior

**Mobile (< 640px)**
- Header nav: Collapsed into hamburger menu
- Breadcrumb: Truncated (home > current page)
- Sidebar (if visible): Drawer overlay (slides from left)

**Tablet (640px - 1023px)**
- Header nav: Horizontal, may wrap
- Breadcrumb: Full, may need scroll
- Sidebar: Condensed (icons + labels) or drawer

**Desktop (1024px+)**
- Header nav: Full horizontal
- Breadcrumb: Full, single line
- Sidebar: Persistent, full labels

### 6.4 Typography Scaling

**Currently**: Only H1 scales with `clamp()`, others fixed

**Recommendation for PRD**:
```css
/* Mobile-first base sizes */
body { font-size: 16px; }

/* Tablet */
@media (min-width: 640px) {
  body { font-size: 16px; } /* no change */
}

/* Desktop */
@media (min-width: 1024px) {
  body { font-size: 17px; } /* slight increase */
}
```

Or keep fixed (simpler maintenance)—**Stakeholder decision needed**

### 6.5 Touch Target Sizing (Mobile)

**Current**: Buttons are `10px padding`, text `14px` (too small)

**Recommended**:
- **Mobile**: Minimum 44x44px tap target
- **Desktop**: 36x36px acceptable

**Updated Button Styles**:
```css
@media (max-width: 639px) {
  .btn {
    padding: 12px 20px; /* ~44px tall */
    min-height: 44px;
  }
}
```

### 6.6 Spacing Adjustments

**Mobile (< 640px)**
- Reduce margins/padding by 25%: `24px → 18px`, `16px → 12px`
- Stack sections vertically (more white space in cramped environment)

**Desktop (1024px+)**
- Keep current spacing (generous, breathing room)

---

## 7. Accessibility Requirements

### 7.1 WCAG 2.1 Level AA Compliance

**Standards to Meet**:
- ✅ Color contrast: 4.5:1 for normal text, 3:1 for large text
- ✅ Keyboard navigation: All interactive elements accessible via Tab
- ✅ Focus indicators: Visible `:focus-visible` outlines
- ✅ Semantic HTML: Proper heading hierarchy, form labels, button roles
- ✅ ARIA labels: Icon-only elements have descriptive labels
- ✅ Screen readers: Page structure announced correctly

### 7.2 Required Additions to Current Implementation

**1. Focus Visible Styles**
```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

**2. ARIA Labels**
```html
<!-- Before -->
<span class="dot" title="Currently building"></span>

<!-- After -->
<span class="dot" aria-label="Status: Currently building"></span>
```

**3. Semantic HTML Fix**
```html
<!-- Before: Not interactive -->
<span class="card-cta">Explore the system</span>

<!-- After: Semantic link -->
<a href="./rules.html" class="card-cta">Explore the system</a>
```

**4. Skip Navigation Link**
```html
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  <header>...</header>
  <main id="main">...</main>
</body>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--accent);
  color: #000;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

**5. Heading Hierarchy**
- Ensure no skipped levels (H1 → H2 → H3, not H1 → H3)
- Only one H1 per page
- Use headings for structure, not styling

**6. Link Text**
- Avoid: "Click here", "Read more", "Link"
- Use: "Explore System", "View Champion Development"

### 7.3 Testing Checklist

- [ ] Tab through all pages—can you reach all interactive elements?
- [ ] Screen reader test (NVDA, JAWS, VoiceOver) on sample pages
- [ ] Color contrast verified (WebAIM Contrast Checker)
- [ ] No keyboard traps (Shift+Tab to escape)
- [ ] Form errors announced clearly

---

## 8. Content Structure Specifications

### 8.1 Play Page Metadata Format

Each play should define:
```yaml
title: "Champion Development"
category: "Workflow" | "Process" | "System"
frequency: "Weekly" | "Monthly" | "As-needed"
status: "Active" | "Beta" | "Archived"
duration: "2 hours" | "Half-day" | "Ongoing"
tags: ["Process", "Ops", "Leverage"]
related_plays:
  - "Play Name 1"
  - "Play Name 2"
updated: "2026-01-14"
```

### 8.2 System Page Metadata Format

Each system component should define:
```yaml
title: "Rules"
section: "System"
description: "Core principles governing Martin's operation"
complexity: "Beginner" | "Intermediate" | "Advanced"
updated: "2026-01-14"
```

### 8.3 Cross-Linking Standards

- "Related plays" section at bottom of each play
- "See also" links between system components
- Breadcrumb at top of every page (except homepage)
- Footer nav with "Prev / Next" pagination (optional)

---

## 9. Performance & Technical Requirements

### 9.1 Performance Budget

- **Page Load Time**: < 2 seconds (4G LTE)
- **First Contentful Paint (FCP)**: < 1 second
- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **Cumulative Layout Shift (CLS)**: < 0.1

**Strategies**:
- Minimize CSS (currently inline, which is good)
- Use system fonts (already done—no external font loading)
- Lazy-load images (if added)
- No JavaScript bloat (current site is minimal)

### 9.2 Browser Support

- Chrome 90+ (98% of users)
- Firefox 88+ (95% of users)
- Safari 14+ (90% of users)
- Edge 90+ (96% of users)
- **Do not support**: IE 11, very old browsers

### 9.3 Mobile Performance

- Aim for 90+ Lighthouse score (mobile)
- Test on 4G LTE connection (via DevTools)
- Minimum touch target: 44x44px

---

## 10. Content Strategy

### 10.1 Tone of Voice

- **Professional, clear, technical** (target audience: builders, ops people)
- Avoid: Casual jargon, marketing speak, excessive metaphors
- Use: Active voice, concrete examples, step-by-step instructions

### 10.2 Content Hierarchy

- **Headline**: What is this?
- **Subheading**: Why does it matter?
- **Body**: How does it work?
- **Footer**: Where do I go next?

### 10.3 Page Template Content Minimum

- **Play Pages**: Title, description, 3+ steps, tags, related plays
- **System Pages**: Title, overview, 3+ subsections, update date
- **Index Pages**: Title, intro paragraph, 3+ linked items

---

## 11. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Finalize design tokens in CSS (colors, spacing, typography)
- [ ] Add accessibility fixes (focus visible, ARIA labels, skip nav)
- [ ] Create component library documentation (Figma or Storybook)

### Phase 2: Navigation (Weeks 2-3)
- [ ] Implement chosen nav model (Option B: Tab bar + sidebar)
- [ ] Build breadcrumb component
- [ ] Test on mobile/tablet/desktop

### Phase 3: Martin Subsystem (Weeks 3-4)
- [ ] Create `/martin/index.html` homepage
- [ ] Build system detail pages (`/martin/system/rules.html`, etc.)
- [ ] Build plays listing and detail pages

### Phase 4: QA & Optimization (Week 5)
- [ ] Accessibility audit (WCAG 2.1 AA compliance)
- [ ] Performance testing (Lighthouse 90+)
- [ ] Cross-browser testing
- [ ] Mobile usability testing

---

## 12. Sign-Off Checklist

**Before finalizing PRD, confirm**:

- [ ] Navigation model chosen (Sidebar, Tab bar, or Breadcrumb?)
- [ ] Mobile hamburger menu agreed upon
- [ ] Accent color usage in active states defined
- [ ] Accessibility requirements confirmed (Level AA or AAA?)
- [ ] Performance targets agreed (< 2 second load time?)
- [ ] Content structure for plays/system pages finalized
- [ ] Responsive breakpoints confirmed (320/640/1024)
- [ ] Stakeholder approval on all sections

---

## Appendix A: Design System Code

```css
:root {
  /* Colors */
  --bg: #0a0a0a;
  --panel: #161616;
  --text: #e8eaf0;
  --muted: #999999;
  --border: #262626;
  --accent: #10b981;
  
  /* Typography */
  --font-sans: ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
  --font-size-base: 16px;
  --font-size-sm: 14px;
  --font-size-xs: 12px;
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.6;
  
  /* Spacing */
  --sp-2: 4px;
  --sp-3: 8px;
  --sp-4: 12px;
  --sp-6: 16px;
  --sp-8: 24px;
  --sp-12: 32px;
  --sp-16: 48px;
  --sp-20: 64px;
  --sp-24: 96px;
  
  /* Radius */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  
  /* Shadows */
  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.4);
}
```

---

## Appendix B: Responsiveness Code Examples

```css
/* Mobile-first: default styles for mobile */
.container {
  width: 92vw;
  margin: 0 auto;
}

.card {
  grid-column: span 12;
}

/* Tablet */
@media (min-width: 640px) {
  .card {
    grid-column: span 6;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    width: min(1200px, 92vw);
  }
  
  .card {
    grid-column: span 6; /* or 4 for 3-column */
  }
  
  .sidebar {
    display: block; /* shown on desktop */
  }
}

/* Mobile nav */
@media (max-width: 639px) {
  nav {
    display: none; /* hidden by default */
  }
  
  .hamburger {
    display: block; /* show hamburger menu */
  }
  
  .nav.open {
    position: fixed;
    left: 0;
    top: 60px;
    width: 100%;
    height: calc(100vh - 60px);
    background: var(--panel);
    z-index: 999;
  }
}
```

---

**End of PRD Document**  
**Version**: 1.0 (DRAFT)  
**Next Step**: Stakeholder review and sign-off
