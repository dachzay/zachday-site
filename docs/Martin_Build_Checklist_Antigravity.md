# Martin Website Build Checklist for Antigravity
**Prepared for**: Antigravity Build Sprint  
**Context**: Build Martin personal OS website to match Stripe/Vercel/Cursor premium aesthetic  
**Status**: Ready for kickoff

---

## 🎯 Build Principles (From Premier Sites Analysis)

Before diving into tasks, here's what Stripe, Vercel, and Cursor do exceptionally well that we're targeting:

**Stripe**:
- ✅ Directional, horizontal "stripe" sections with purposeful color breaks
- ✅ Sophisticated animations: direction-aware hover effects (follow mouse path)
- ✅ Deep information hierarchy: complex nav feels intuitive
- ✅ Accessibility first: WCAG compliance built into every component
- ✅ CSS Grid for layout (robust, responsive, maintainable)

**Vercel**:
- ✅ Clean, minimal header with intelligent nav (doesn't show everything)
- ✅ Micro-interactions: optimistic updates, loading states, state persistence in URL
- ✅ Design system as code: tokens drive everything (shadcn/ui, Tailwind)
- ✅ URL as state: share, refresh, back/forward all work seamlessly
- ✅ Web Interface Guidelines published and followed rigorously

**Cursor**:
- ✅ Purpose-driven sections with clear information priority
- ✅ Component inspection philosophy: every UI element is inspectable
- ✅ Visual editor mindset: design system is visible and tweakable
- ✅ Responsive by default (Tailwind-first approach)
- ✅ Point-and-prompt interaction patterns

---

## ✅ PHASE 0: Pre-Build Setup (Weeks -1 → 0)

### 0.1 Project Setup
- [ ] Create GitHub repo (private initially) with this folder structure:
  ```
  martin-site/
  ├── src/
  │   ├── index.html
  │   ├── css/
  │   │   ├── design-tokens.css (all colors, spacing, typography)
  │   │   ├── components.css
  │   │   ├── layout.css
  │   │   └── responsive.css
  │   ├── js/ (minimal, for interactions only)
  │   ├── martin/
  │   │   ├── index.html
  │   │   ├── system/
  │   │   │   ├── index.html
  │   │   │   ├── rules.html
  │   │   │   ├── context.html
  │   │   │   └── protocols.html
  │   │   └── plays/
  │   │       ├── index.html
  │   │       ├── champion-development.html
  │   │       └── [others].html
  │   └── assets/
  │       ├── icons/
  │       ├── illustrations/ (if any)
  │       └── brand/
  ├── .github/workflows/ (CI/CD for Netlify/Vercel deploy)
  ├── README.md (build notes)
  └── DESIGN_TOKENS.md (source of truth for design system)
  ```

- [ ] Set up build tooling (choose one):
  - **Option A (Lightweight)**: Just HTML/CSS/JS, no build step
  - **Option B (Modern)**: Vite + PostCSS for CSS processing
  - **Option C (Enterprise)**: Next.js (React SSG for future scalability)
  - **Recommendation**: Option A for launch speed, migrate to B/C if needed later

- [ ] Initialize CI/CD for preview deploys (Netlify or Vercel)
- [ ] Create Figma file for design tokens (shared source of truth)

### 0.2 Design Token Documentation
- [ ] Finalize all tokens in `DESIGN_TOKENS.md`:
  ```
  COLORS:
  - --bg: #0a0a0a (background)
  - --panel: #161616 (card/panel background)
  - --text: #e8eaf0 (primary text)
  - --muted: #999999 (secondary text)
  - --border: #262626 (dividers)
  - --accent: #10b981 (emerald - expand usage)
  - --error: #ef4444 (future)
  - --success: #10b981 (same as accent for now)
  
  TYPOGRAPHY:
  - Font: ui-sans-serif, system-ui (no external fonts)
  - Scales: defined
  - Line-heights: standardized
  
  SPACING:
  - Base unit: 8px
  - Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96
  
  RADIUS:
  - Cards: 8px
  - Buttons: 6px
  - Pills: 4px
  ```
- [ ] Convert tokens to CSS custom properties (`:root` in `design-tokens.css`)
- [ ] Create component spec in Figma with all states (hover, focus, active, disabled, loading)

### 0.3 Navigation Model Decision
- [ ] **Choose**: Sidebar + Top Tabs vs. Breadcrumb-based vs. Mega menu
- [ ] Create wireframe for chosen model on mobile/tablet/desktop
- [ ] Design active state indicators (highlight style)
- [ ] Plan mobile hamburger menu behavior

---

## ✅ PHASE 1: Foundation Build (Weeks 1-2)

### 1.1 HTML Structure & Semantics
- [ ] **Landing Page** (`src/index.html`)
  - [ ] Semantic structure: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
  - [ ] Breadcrumb navigation component (empty on homepage)
  - [ ] Skip navigation link (accessibility)
  - [ ] Meta tags: og:image, og:description, canonical URLs
  - [ ] JSON-LD structured data (optional but nice for portfolio)

- [ ] **Martin Homepage** (`src/martin/index.html`)
  - [ ] Hero section with system intro
  - [ ] "System" section with 3 cards (Rules, Context, Protocols)
  - [ ] "Plays" section preview (3-5 featured)
  - [ ] Stub sections for Innovations, Metrics, Standards, Roadmap

- [ ] **System Index** (`src/martin/system/index.html`)
  - [ ] Breadcrumb: Martin > System
  - [ ] 3-column card grid: Rules, Context, Protocols

- [ ] **System Detail Pages** (`src/martin/system/[section].html`)
  - [ ] Breadcrumb navigation
  - [ ] Title + metadata (updated date, status)
  - [ ] Table of contents (sticky on desktop, collapsed on mobile)
  - [ ] Content area (Markdown-friendly structure)
  - [ ] Related links section

- [ ] **Plays Index** (`src/martin/plays/index.html`)
  - [ ] Breadcrumb: Martin > Plays
  - [ ] Play cards grid (2 columns, responsive)
  - [ ] Optional: Tag filtering UI (don't implement, just HTML)

- [ ] **Play Detail Pages** (`src/martin/plays/[play].html`)
  - [ ] Breadcrumb navigation
  - [ ] Overview section
  - [ ] Numbered steps (can be cards or list)
  - [ ] Tools/outputs section
  - [ ] Related plays section

- [ ] **ARIA & Accessibility**
  - [ ] `aria-label` on all icon-only elements
  - [ ] `aria-current="page"` on active nav items
  - [ ] `role="navigation"` on nav regions
  - [ ] `aria-live="polite"` for status messages (future)
  - [ ] Form labels with `<label for="">` (if any forms)

### 1.2 CSS Foundation
- [ ] **Design Tokens** (`css/design-tokens.css`)
  - [ ] All color tokens as CSS custom properties
  - [ ] Typography scale (font-size, line-height, letter-spacing)
  - [ ] Spacing scale (margins, padding, gaps)
  - [ ] Border radius tokens
  - [ ] Shadow scale (if using shadows)
  - [ ] Transitions (duration, easing)

- [ ] **Component Styles** (`css/components.css`)
  - [ ] Button (primary, secondary, all states: default, hover, focus, active, disabled)
  - [ ] Card (default, hover)
  - [ ] Link (underlined text link, with underline animation)
  - [ ] Pill (tag style)
  - [ ] Breadcrumb (with separator styling)
  - [ ] Navigation pill bar (for tab-like nav)
  - [ ] Sidebar (layout structure, no JS for show/hide yet)

- [ ] **Layout** (`css/layout.css`)
  - [ ] Container (max-width 800px, 92vw on mobile)
  - [ ] Grid system (12-column grid, gaps, responsive)
  - [ ] Flexbox utilities (for nav, buttons)
  - [ ] Section spacing

- [ ] **Responsive** (`css/responsive.css`)
  - [ ] Mobile first: no max-width styles for mobile base
  - [ ] Tablet breakpoint: 640px
  - [ ] Desktop breakpoint: 1024px
  - [ ] Touch target sizing: 44x44px minimum on mobile

### 1.3 Component Library Documentation
- [ ] Create `COMPONENTS.md` with code samples for:
  - [ ] Button variations
  - [ ] Links (text, button, CTA)
  - [ ] Cards
  - [ ] Breadcrumbs
  - [ ] Nav pills
  - [ ] Badge/tags
  - [ ] Empty states
  - [ ] Stub sections

- [ ] Each component should show:
  - HTML markup
  - CSS classes used
  - Accessibility notes
  - Mobile considerations

---

## ✅ PHASE 2: Navigation & Interaction (Weeks 2-3)

### 2.1 Navigation System Implementation

**Choose one approach** (based on PHASE 0 decision):

**Option A: Sidebar + Top Nav (Recommended)**
- [ ] Create sidebar navigation component
  - [ ] On desktop: persistent, ~250px wide, left side
  - [ ] On mobile: hidden by default, slides in from left when hamburger clicked
  - [ ] Active state: left border + highlight on current page
  - [ ] Hover states: color change, slight background highlight
  - [ ] Nested items indentation (for System subsections)

- [ ] Create hamburger menu button (mobile only)
  - [ ] Button shows at < 1024px breakpoint
  - [ ] Animated hamburger icon (3 lines → X on open)
  - [ ] Click toggles `.nav-open` class on sidebar

- [ ] Top nav tabs for main sections
  - [ ] Martin | System | Plays | Innovations | Metrics | Standards | Roadmap
  - [ ] Indicator line under active section
  - [ ] On mobile: scrollable horizontal pills

- [ ] Breadcrumb on all detail pages
  - [ ] Format: Martin > Section > Page
  - [ ] Last item not a link (current page)
  - [ ] Mobile: truncate with ellipsis if needed

### 2.2 Interactive States (CSS-based, no JS yet)
- [ ] Button states:
  - [ ] `:hover` (color/border change)
  - [ ] `:focus-visible` (outline with accent color)
  - [ ] `:active` (slight scale down)
  - [ ] `.disabled` (opacity 0.5, cursor not-allowed)

- [ ] Link states:
  - [ ] `:hover` (underline animation: fade in accent color)
  - [ ] `:focus-visible` (outline)
  - [ ] `:visited` (muted color, optional)

- [ ] Card states:
  - [ ] `:hover` (border-color lighter)
  - [ ] `:focus-within` (if clickable card)

- [ ] Nav item states:
  - [ ] `.active` (highlight + left border)
  - [ ] `:hover` (subtle background highlight)
  - [ ] `:focus` (outline)

### 2.3 Minimal JavaScript (Only If Needed)
- [ ] Hamburger menu toggle (add/remove `.nav-open` class)
- [ ] Smooth scroll to sections (optional, can use CSS `scroll-behavior: smooth`)
- [ ] Table of contents auto-highlight (based on scroll position)
- [ ] **NO** animations libraries yet (keep Lighthouse score high)

### 2.4 Animation Plan (CSS-based)
- [ ] Hover animations:
  - [ ] Button: 0.15s ease-in-out
  - [ ] Link underline: 0.15s ease-in-out
  - [ ] Card border: 0.15s ease-in-out
  - [ ] Nav pill: 0.15s ease-in-out

- [ ] Stripe-style direction-aware hover (optional, for future polish):
  - [ ] Use CSS `transition` (simple version)
  - [ ] Advanced version: Framer Motion (requires React, skip for Phase 2)

---

## ✅ PHASE 3: Content & Pages (Weeks 3-4)

### 3.1 Landing Page Content
- [ ] Hero section copy (finalized)
- [ ] Featured projects intro
- [ ] Links to Martin system
- [ ] Call-to-actions (button copy finalized)
- [ ] About/Contact sections (can be minimal "coming soon")

### 3.2 Martin System Pages
- [ ] System overview page content
- [ ] Rules page (structure: intro + 3-5 rules + examples)
- [ ] Context page (structure: intro + core concepts)
- [ ] Protocols page (structure: intro + protocol definitions)
- [ ] Add metadata to each page (date updated, status, difficulty)

### 3.3 Martin Plays Pages
- [ ] Plays index: list of all plays with descriptions
- [ ] Champion Development play (example play with full detail)
  - [ ] Overview section
  - [ ] Step-by-step breakdown (at least 5-7 steps)
  - [ ] Tools/outputs section
  - [ ] Related plays links
- [ ] 2-3 additional plays (stub or full, TBD)

### 3.4 Stub/Incomplete Sections
- [ ] Innovations: "Coming soon" placeholder (styled consistently)
- [ ] Metrics: "Coming soon" placeholder
- [ ] Standards: "Coming soon" placeholder
- [ ] Roadmap: "Coming soon" placeholder

### 3.5 Content Structure Validation
- [ ] All internal links working (no 404s)
- [ ] Breadcrumbs showing correctly on all pages
- [ ] Mobile layout tested on each page
- [ ] Typography hierarchy verified (H1 > H2 > H3 > body)
- [ ] No orphaned pages (all pages linked from nav or index)

---

## ✅ PHASE 4: Polish & Optimization (Weeks 4-5)

### 4.1 Accessibility Audit (WCAG 2.1 Level AA)
- [ ] **Color Contrast**: Verify all text meets 4.5:1 (normal) / 3:1 (large)
  - Use: WebAIM Contrast Checker
  - Focus: --text on --bg, --muted on --panel, etc.

- [ ] **Keyboard Navigation**:
  - [ ] Tab through all pages - every interactive element reachable
  - [ ] Focus order logical (top to bottom, left to right)
  - [ ] No keyboard traps (can escape focus)
  - [ ] Focus visible outline clearly visible

- [ ] **Screen Reader Testing** (at least one):
  - Use: NVDA (Windows, free) or VoiceOver (Mac, built-in)
  - Check: Page title announced, headings hierarchy, link text descriptive
  - Landmarks: nav, main, footer regions announced

- [ ] **Semantic HTML**:
  - [ ] All links are `<a>` tags (not `<button>` or `<div>`)
  - [ ] All buttons are `<button>` tags
  - [ ] Form fields have `<label>` elements
  - [ ] Heading hierarchy (no skipped levels)

- [ ] **ARIA Labels**:
  - [ ] Icon-only buttons have `aria-label`
  - [ ] Current page nav items have `aria-current="page"`
  - [ ] Nav regions have `role="navigation"` or semantic `<nav>`

- [ ] **Animation**:
  - [ ] `prefers-reduced-motion` media query applied
  - [ ] All animations can be disabled

### 4.2 Performance Optimization
- [ ] **Lighthouse Audit** (Chrome DevTools)
  - [ ] Target: 90+ score on all metrics
  - [ ] First Contentful Paint (FCP): < 1 second
  - [ ] Largest Contentful Paint (LCP): < 2.5 seconds
  - [ ] Cumulative Layout Shift (CLS): < 0.1
  - [ ] Time to Interactive (TTI): < 3 seconds

- [ ] **CSS Optimization**:
  - [ ] No unused CSS (audit with coverage tool)
  - [ ] Minify CSS for production
  - [ ] Critical CSS (above-fold) inlined in `<head>` (optional)

- [ ] **HTML Optimization**:
  - [ ] No render-blocking resources
  - [ ] Inline SVG icons (no extra HTTP requests)
  - [ ] Lazy-load images (if any added later)

- [ ] **JavaScript (if added)**:
  - [ ] Minify & bundle
  - [ ] No synchronous scripts in `<head>`
  - [ ] Defer non-critical scripts

- [ ] **Asset Optimization**:
  - [ ] No images > 100KB
  - [ ] WebP format (with fallback) for images
  - [ ] Favicon optimized

### 4.3 Responsive Design Testing
- [ ] **Device Testing** (real devices if possible, or DevTools):
  - [ ] iPhone SE (375px) - smallest phone
  - [ ] iPhone 12 (390px) - common phone
  - [ ] iPad (768px) - tablet portrait
  - [ ] iPad landscape (1024px) - tablet landscape
  - [ ] Desktop (1440px) - laptop/desktop

- [ ] **Breakpoint Verification**:
  - [ ] 640px breakpoint: grid changes, nav optimizes
  - [ ] 1024px breakpoint: sidebar appears, layout expands
  - [ ] Touch targets: all 44x44px minimum on mobile

- [ ] **Content Test**:
  - [ ] Long titles don't break layout
  - [ ] Links wrap properly
  - [ ] Code blocks (if any) don't overflow on mobile
  - [ ] Tables (if any) scroll horizontally on mobile

### 4.4 Cross-Browser Testing
- [ ] Chrome 90+ (latest 2 versions)
- [ ] Firefox 88+ (latest 2 versions)
- [ ] Safari 14+ (latest 2 versions)
- [ ] Edge 90+ (latest 2 versions)
- [ ] Mobile Safari (iOS 14+)
- [ ] Chrome Mobile (latest)

- [ ] Check for:
  - [ ] CSS Grid support (all modern browsers ✓)
  - [ ] CSS custom properties support (all modern browsers ✓)
  - [ ] Flexbox support (all modern browsers ✓)
  - [ ] Form elements render correctly
  - [ ] Fonts load correctly

### 4.5 SEO & Meta Tags
- [ ] **Landing Page**:
  - [ ] `<title>`: "Zach — Personal OS & Projects"
  - [ ] `<meta name="description">`: ~150 chars summary
  - [ ] `<meta name="og:image">`: link to preview image
  - [ ] `<meta name="og:description">`: same as description
  - [ ] `<link rel="canonical">`: set to actual URL

- [ ] **Martin Pages**:
  - [ ] Unique title for each page
  - [ ] Description meta tag
  - [ ] Structured data (JSON-LD) for breadcrumbs

- [ ] **Robots & Sitemap**:
  - [ ] `robots.txt` (allow all for public site)
  - [ ] `sitemap.xml` (list all pages)

---

## ✅ PHASE 5: Testing & Deployment (Week 5)

### 5.1 QA Testing Checklist
- [ ] **Functionality**:
  - [ ] All links work (no 404s)
  - [ ] All buttons clickable and navigate correctly
  - [ ] Mobile hamburger menu opens/closes
  - [ ] Breadcrumbs display correctly on each page
  - [ ] No console errors or warnings (F12)

- [ ] **Content**:
  - [ ] All copy proofread (no typos)
  - [ ] All metadata filled (dates, authors, status)
  - [ ] All images/icons load correctly
  - [ ] All code examples (if any) render correctly

- [ ] **Styling**:
  - [ ] Consistent spacing throughout (use design tokens)
  - [ ] Consistent typography (use scale)
  - [ ] Hover/focus states visible and consistent
  - [ ] No broken layouts on any page

### 5.2 Build & Deploy Setup
- [ ] **Build Process**:
  - [ ] Test build locally: `npm run build` or equivalent
  - [ ] Verify output is static HTML/CSS/JS (no Node deps)
  - [ ] Check bundle size is < 100KB gzipped

- [ ] **Deployment Platform** (choose one):
  - [ ] **Netlify**: Connect GitHub repo, auto-deploy on push
  - [ ] **Vercel**: Connect GitHub repo, auto-deploy on push
  - [ ] **Custom hosting**: Upload to server, set up caching headers

- [ ] **CI/CD Setup** (in `.github/workflows/`):
  - [ ] Run Lighthouse audit on preview deploy
  - [ ] Run accessibility audit (pa11y or similar)
  - [ ] Run link checker (no broken links)
  - [ ] Deploy to staging on PR, production on merge to `main`

### 5.3 Pre-Launch Checklist
- [ ] [ ] No console errors or warnings
- [ ] [ ] Lighthouse score 90+ on all metrics
- [ ] [ ] Accessibility audit passes (WCAG 2.1 AA)
- [ ] [ ] All links internal and external working
- [ ] [ ] Mobile responsive on all breakpoints
- [ ] [ ] Browser compatibility verified
- [ ] [ ] Social share meta tags tested (Twitter, LinkedIn, etc.)
- [ ] [ ] Analytics script added (if using Google Analytics)
- [ ] [ ] 404 page created (custom error page)
- [ ] [ ] Favicon set
- [ ] [ ] Staging URL shared with stakeholders for final review

### 5.4 Launch
- [ ] [ ] DNS / custom domain configured
- [ ] [ ] SSL certificate installed (auto-renew enabled)
- [ ] [ ] CDN caching configured (cache headers set)
- [ ] [ ] Production environment variables set
- [ ] [ ] Final smoke test on production URL
- [ ] [ ] Announce launch (social, email, etc.)

---

## 📋 Deliverables Checklist

**By End of Phase 1 (Week 2)**:
- ✅ GitHub repo with folder structure
- ✅ All HTML files (structure complete, minimal content OK)
- ✅ Design tokens CSS file (all colors, spacing, typography)
- ✅ Component CSS file (buttons, cards, links, all states)
- ✅ Layout CSS file (container, grid, responsive)
- ✅ COMPONENTS.md documentation

**By End of Phase 2 (Week 3)**:
- ✅ Navigation system implemented (sidebar/tabs/breadcrumb)
- ✅ Hamburger menu working on mobile
- ✅ All CSS interactive states (hover, focus, active, disabled)
- ✅ Minimal JS for menu toggle only
- ✅ Mobile responsive design tested on all breakpoints

**By End of Phase 3 (Week 4)**:
- ✅ All page content written and validated
- ✅ All internal links working
- ✅ All pages tested on mobile/tablet/desktop
- ✅ All images/icons loaded correctly

**By End of Phase 4 (Week 5)**:
- ✅ WCAG 2.1 AA compliance verified
- ✅ Lighthouse 90+ on all metrics
- ✅ Cross-browser testing completed
- ✅ SEO meta tags set
- ✅ All performance optimizations applied

**By Launch**:
- ✅ Production build tested locally
- ✅ CI/CD pipeline working
- ✅ Staging environment passes all tests
- ✅ Production deployment successful
- ✅ All monitoring/analytics configured

---

## 🚀 Tech Stack Recommendation

**Core**:
- HTML5 (semantic)
- CSS3 (Grid, Flexbox, custom properties)
- Vanilla JavaScript (minimal, no frameworks)

**Build & Deploy**:
- Git + GitHub
- Netlify or Vercel (auto-deploy on push)
- GitHub Actions (CI/CD)

**Tooling** (optional for Phase 1, add in Phase 2 if needed):
- PostCSS (for CSS processing)
- Prettier (code formatting)
- ESLint (JS linting)
- Lighthouse CI (automated performance tests)

**No external dependencies** initially:
- No jQuery, Bootstrap, or CSS frameworks
- No animation libraries (Framer Motion, etc.)
- System fonts only (no Google Fonts or web fonts)

---

## 📞 Handoff Notes for Antigravity

1. **Design is locked**: All colors, spacing, typography defined in this checklist. No design decisions needed.
2. **Navigation model**: Choose ONE option early (Sidebar + Tabs recommended). Design depends on this choice.
3. **Content is provided**: All copy for landing page + Martin system is provided separately. Just build structure.
4. **Accessibility first**: All checkboxes in Phase 4 are non-negotiable. Build with a11y in mind from the start.
5. **Mobile first**: Design mobile (320px) first, then scale up. Don't build desktop-first and squeeze to mobile.
6. **Performance matters**: Lighthouse 90+ is the bar. This is a showcase site—speed reflects Zach's standards.
7. **No design debt**: Build it right the first time. Technical debt compounds on personal projects.
8. **Future: Next.js migration**: This HTML/CSS site is v1. Phase 2 (later) can migrate to Next.js if needed for CMS, forms, or dynamic content.

---

**Ready for Antigravity to begin Phase 1. Questions? See DESIGN_TOKENS.md and COMPONENTS.md in the repo for detailed specifications.**
