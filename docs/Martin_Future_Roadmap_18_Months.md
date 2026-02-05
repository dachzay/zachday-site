# Martin Website: 18-Month Future State Roadmap
**Vision**: Evolve from a documentation site to a premium interactive product showcase that rivals Stripe, Vercel, and Cursor's design and functionality.

**Timeline**: Q1 2026 (Launch) → Q4 2027 (Premium Showcase)

---

## Executive Summary

The Martin website will evolve through 4 major phases, each adding sophistication while maintaining the core aesthetic:

1. **Phase 1 (Q1 2026)**: Static HTML launch - clean, fast, accessible
2. **Phase 2 (Q2-Q3 2026)**: Interactive polish - animations, micro-interactions, dynamic nav
3. **Phase 3 (Q4 2026 - Q1 2027)**: Dynamic content - API integration, real-time updates, personalization
4. **Phase 4 (Q2-Q4 2027)**: Premium experience - advanced analytics, community features, monetization prep

Each phase builds on the last without requiring a full rewrite. The architecture supports this evolution.

---

## 🎯 Design Philosophy Evolution

### Current (Launch)
- **Aesthetic**: Dark mode, minimal, clean
- **Interaction**: Hover states, smooth scrolling
- **Performance**: < 2 seconds load, 90+ Lighthouse
- **Accessibility**: WCAG 2.1 AA
- **Content**: Static, hand-curated

### Target (Q4 2027)
- **Aesthetic**: Dark mode + premium polish (Stripe-level)
- **Interaction**: Direction-aware animations, intelligent components, lazy-loaded experiences
- **Performance**: < 1 second load, 95+ Lighthouse, Core Web Vitals optimized
- **Accessibility**: WCAG 2.1 AAA (exceeds standard)
- **Content**: Dynamic, personalized, real-time updated

---

## PHASE 1: Static HTML Launch (Q1 2026)
**Goal**: Ship a fast, accessible, beautiful foundation.

### Deliverables
- ✅ Static HTML/CSS website
- ✅ Responsive design (mobile-first)
- ✅ WCAG 2.1 AA compliance
- ✅ Lighthouse 90+ score
- ✅ Custom domain & HTTPS
- ✅ SEO setup
- ✅ Social sharing meta tags

### Tech Stack
- HTML5 + CSS3 (no framework)
- Vanilla JS (minimal)
- Git + GitHub
- Netlify/Vercel (deploy)

### Design Highlights
- Dark theme: `#0a0a0a` background
- Emerald accent: `#10b981`
- System fonts (no external loads)
- Horizontal stripe sections
- Consistent hover animations (0.15s)

### No
- ✗ JavaScript frameworks (React, Vue, etc.)
- ✗ External font loads
- ✗ Analytics tracking
- ✗ CMS integration
- ✗ API calls

### Post-Launch Optimization
- [ ] Monitor Core Web Vitals in production
- [ ] Set up Sentry for error tracking
- [ ] Collect user feedback (Google Forms)
- [ ] Plan Phase 2 based on usage patterns

---

## PHASE 2: Interactive Polish & Micro-Interactions (Q2-Q3 2026)
**Goal**: Add sophistication through animations and intelligent components without adding bloat.

### New Features

#### 2.1 Directional Hover Animation (Stripe-style)
**What**: When hovering over navigation items or cards, the background highlight follows your mouse direction.

**Tech**: CSS + minimal Vanilla JS, or Framer Motion if adopting React
```javascript
// Direction-aware animation
const nav = document.querySelector('.nav-item');
nav.addEventListener('mousemove', (e) => {
  const rect = nav.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  nav.style.setProperty('--mouse-x', x + 'px');
  nav.style.setProperty('--mouse-y', y + 'px');
});
```

**Scope**: Apply to:
- Navigation tabs
- Card elements
- CTA buttons
- Featured project cards

**Visual**: Subtle gradient background follows cursor position (100ms debounce)

#### 2.2 Scroll-Based Active Section (Vercel-style)
**What**: As users scroll, the nav highlights which section they're currently viewing.

**Tech**: Intersection Observer API (no external library needed)
```javascript
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-item');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navItems.forEach(item => item.classList.remove('active'));
      document.querySelector(`[data-section="${id}"]`).classList.add('active');
    }
  });
}, { threshold: 0.5 });

sections.forEach(section => observer.observe(section));
```

**Scope**: Apply to main landing page and Martin subsystem pages

#### 2.3 Animated Loading States
**What**: When pages are loading or content is fetching, show animated skeletons.

**Tech**: CSS animations (no JS needed)
```css
@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.skeleton {
  background: var(--panel);
  animation: pulse 1.5s ease-in-out infinite;
  border-radius: var(--radius-md);
}
```

**Scope**: Use for:
- Play cards loading
- Dynamic content sections
- Future API-based content

#### 2.4 Link Underline Animation
**What**: When hovering a link, the underline animates from left to right (or custom direction).

**Tech**: CSS using `::after` pseudo-element
```css
a {
  position: relative;
  text-decoration: none;
}

a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent);
  transition: width 0.3s ease-out;
}

a:hover::after {
  width: 100%;
}
```

**Scope**: All navigation links, internal links in content

#### 2.5 Smooth Page Transitions
**What**: When navigating between pages, a subtle fade or slide animation transitions the view.

**Tech**: CSS animations or Framer Motion (if adding React)
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

main {
  animation: fadeIn 0.3s ease-in;
}
```

**Scope**: All page navigations (uses browser's `<a>` navigation, not AJAX)

#### 2.6 Mobile-Specific Interactions
**What**: 
- Hamburger menu animation (3-line → X)
- Drawer slide-in animation from left
- Pull-to-refresh inspiration (stretch effect on scroll)

**Tech**: CSS animations + Vanilla JS toggle

#### 2.7 Expanded Accent Color Usage
**What**: Use `#10b981` (emerald) more strategically:
- Link hover underlines
- Active nav item highlight
- Focus outlines
- Error states (if forms added later)
- Loading spinners

**Current**: Accent used only for status dot  
**New**: Expand to 15+ UI elements

### Performance Considerations
- **CSS Animations**: No performance hit (GPU accelerated)
- **JS Animations**: Keep animations to < 500ms (user perceives instant feedback)
- **Bundle Size**: Stays < 50KB total (animations via CSS, no libraries)
- **Frame Rate**: Target 60fps (check with Chrome DevTools)

### Accessibility Updates
- [ ] All animations respect `prefers-reduced-motion`
- [ ] Loading states announced via `aria-live` regions
- [ ] Keyboard navigation still works (no click-only interactions)
- [ ] Focus visible on all animated elements

### Timeline
- Week 1-2: Directional hover animation (navigation)
- Week 3: Scroll-based active section
- Week 4: Animated loading states
- Week 5: Link underline animation
- Week 6: Page transitions
- Week 7: Mobile interactions
- Week 8: Testing & optimization

### Deliverables
- ✅ Stripe-style directional hover effects
- ✅ Scroll-based active section highlighting
- ✅ Animated loading states
- ✅ Link hover animations
- ✅ Page transition effects
- ✅ Mobile interaction polish
- ✅ Performance audit (Lighthouse 92+)
- ✅ Accessibility re-audit (WCAG 2.1 AA maintained)

---

## PHASE 3: Dynamic Content & API Integration (Q4 2026 - Q1 2027)
**Goal**: Move from static to semi-dynamic while maintaining speed and simplicity.

### 3.1 Backend Infrastructure

**Tech Choice**:
- **Option A**: Headless CMS (Contentful, Sanity, Strapi)
- **Option B**: Custom Node.js API + PostgreSQL
- **Option C**: Hybrid (Markdown files in GitHub + GitHub API)

**Recommendation**: Option C (Markdown + GitHub API) for MVP:
- Free tier for hosting files
- Simple, no external dependencies
- Perfect for documentation-style content
- Scales to full CMS later if needed

### 3.2 Dynamic Content Types

#### 3.2.1 Play Pages
**Current**: Hand-written HTML files  
**Future**: Store in GitHub `/content/plays/*.md`, fetch and render dynamically

**Structure**:
```markdown
---
title: Champion Development
category: Workflow
frequency: Weekly
status: Active
tags: [Process, Ops, Leverage]
updated: 2026-03-15
related_plays:
  - Play X
  - Play Y
---

# Overview
...

# Steps
1. Step one
2. Step two
...
```

**Rendering**: Server-side (Next.js) or Client-side (fetch + render)

#### 3.2.2 System Documentation Pages
**Current**: Static HTML  
**Future**: Markdown-based, versioned in Git

**Benefit**: Non-technical Zach can edit content without touching code

#### 3.2.3 Metadata & Signals
**New Content to Add**:
- Views per page (from analytics)
- Last updated timestamp (auto from Git)
- Author (if team built out)
- Difficulty/complexity level
- Time to read

### 3.3 Real-Time Updates

#### 3.3.1 GitHub Webhooks
**What**: When content in GitHub is updated, the site rebuilds automatically.

**Flow**:
1. Push to `main` branch with new/updated content
2. GitHub webhook triggers CI/CD
3. Site rebuilds and deploys (Netlify/Vercel)
4. Users see fresh content within 1 minute

**Implementation**: Standard with Netlify/Vercel (no extra setup)

#### 3.3.2 Last Updated Badges
**What**: Show when each page was last updated (pulled from Git metadata).

**Visual**:
```
Last updated: March 15, 2026
```

**Tech**: Git API call at build time (or runtime if using client-side render)

#### 3.3.3 Content Versioning
**What**: Archive old versions of plays/protocols, allow users to see what changed.

**Optional**: Save time for Phase 4 (not MVP)

### 3.4 Personalization (Optional)

#### 3.4.1 User Preferences
**What**: Allow visitors to set preferences (dark/light mode, reading speed, etc.).

**Storage**: LocalStorage (no login required)

**Options**:
- [ ] Dark / Light mode toggle
- [ ] Font size adjustment
- [ ] Reduced motion preference
- [ ] Bookmarks / saved plays

#### 3.4.2 Reading Progress
**What**: Show progress bar as user scrolls through long pages.

**Tech**: CSS + Vanilla JS (2 lines of code)

#### 3.4.3 Related Content Suggestions
**What**: At bottom of each page, show "People who read this also read..."

**Tech**: Simple algorithmic matching (if user reads "Rules", suggest related pages)

### 3.5 Search Functionality

**What**: Full-text search across all pages (plays, system docs, etc.).

**Tech Options**:
- **Option A**: Algolia (hosted, $0 for small sites)
- **Option B**: Lunr.js (client-side, no server needed)
- **Option C**: Meilisearch (self-hosted, more powerful)

**Recommendation**: Lunr.js for Phase 3 (no external dependencies)

**UX**: 
- Search box in header
- Keyboard shortcut: `Cmd/Ctrl + K` (Vercel-style)
- Results dropdown with preview text
- Search analytics (what are people looking for?)

### 3.6 Tech Stack Evolution

**Current (Phase 1)**:
- Static HTML/CSS/JS
- Netlify/Vercel (deploy)

**Phase 3**:
- Add Next.js (static generation + dynamic routes)
- API layer (Node.js + Express or Remix)
- Content storage (GitHub or CMS)
- Search backend (Algolia or Meilisearch)

**Why Next.js**:
- Server-side rendering for SEO
- Static generation for performance
- API routes for backend
- Built-in image optimization
- Easy Vercel deployment

**Migration Path**:
- Phase 1 → Phase 2: Pure HTML/CSS (no framework needed)
- Phase 2 → Phase 3: Migrate to Next.js (Zach, not Antigravity)
  - Reuse CSS tokens, components
  - Add React layer on top
  - Keep design system intact

### Timeline
- Week 1-2: Set up Next.js with existing HTML/CSS
- Week 3-4: Build Markdown content parser
- Week 5: GitHub integration + CI/CD
- Week 6: Search implementation (Lunr.js)
- Week 7: User preferences + LocalStorage
- Week 8: Testing, optimization, docs

### Deliverables
- ✅ Next.js site with dynamic content routes
- ✅ Markdown-based content management
- ✅ GitHub webhook integration
- ✅ Full-text search (Cmd+K shortcut)
- ✅ Last updated metadata on all pages
- ✅ User preferences (theme, font size, etc.)
- ✅ Reading progress indicators
- ✅ Lighthouse 90+ maintained
- ✅ Page load time < 1.5 seconds

---

## PHASE 4: Premium Polish & Advanced Features (Q2-Q4 2027)
**Goal**: Make Martin a best-in-class product showcase rivaling Stripe, Vercel, Cursor.

### 4.1 Advanced Animations & Interactive Experiences

#### 4.1.1 Direction-Aware Entrance Animations
**What**: When sections come into view, they animate in from the direction of scroll.

**Tech**: Intersection Observer + Framer Motion

```javascript
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

return (
  <motion.div
    initial="hidden"
    whileInView="visible"
    variants={variants}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);
```

**Scope**: Every major section (hero, card grid, etc.)

#### 4.1.2 Parallax Scrolling (Selective)
**What**: Background elements move slower than foreground (creates depth).

**Tech**: CSS scroll-behavior + Framer Motion scroll trigger
- Use sparingly (Stripe uses it thoughtfully, not everywhere)
- Only on hero sections or hero-adjacent elements

#### 4.1.3 Cursor Tracking Effects
**What**: Subtle effects follow mouse cursor (glow, highlight, etc.).

**Tech**: Vanilla JS + CSS variables
```javascript
document.addEventListener('mousemove', (e) => {
  document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
  document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
});
```

**Scope**: Hero section, card backgrounds, accent elements

#### 4.1.4 Smooth Page Transitions with State Preservation
**What**: Navigate between pages with animated transitions (not instant).

**Tech**: Next.js with Framer Motion page transitions
- Preserve scroll position on back
- Show loading state while content fetches
- Fade/slide animations (configurable)

#### 4.1.5 Component Interaction Patterns

**Expandable/Collapsible Sections**:
- Click to expand play detail
- Smooth height animation
- Accessible keyboard support

**Tabs**:
- Underline indicator animates to active tab
- Content fades in
- URL updates (shareable state)

**Modals/Overlays**:
- Blur background
- Entrance animation
- Escape key closes
- Focus management

### 4.2 Content & Community Features

#### 4.2.1 Play Ratings & Feedback
**What**: Users can rate/vote on plays ("Helpful" / "Not Helpful").

**Tech**: Firebase or Supabase for anonymous voting
- No login required
- Stores vote in LocalStorage to prevent duplicates
- Shows count to other visitors

**Visual**: Thumbs up/down buttons at bottom of each play

#### 4.2.2 Comments & Discussion
**What**: Discourse or GitHub Discussions integration for community feedback.

**Options**:
- Embed GitHub Discussions (free, integrates with repo)
- Use Disqus (free tier available)
- Self-host Discourse (advanced)

**Recommendation**: GitHub Discussions (free, fits workflow)

#### 4.2.3 Contributor Attribution
**What**: Show who contributed to/improved each page.

**Tech**: GitHub API to pull contributor info from commits

**Visual**:
```
Last updated by Zach Day on March 15, 2026
Contributors: Zach Day, Jane Smith
```

#### 4.2.4 Share Features
**What**: One-click share to Twitter, LinkedIn, Email.

**Tech**: Simple share links (no external library needed)
```javascript
const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(pageUrl)}`;
```

**Visual**: Share icons in header/footer

#### 4.2.5 Newsletter Integration
**What**: "Subscribe to updates" (new plays, system changes).

**Tech**: Mailchimp, ConvertKit, or Substack
- Email form with subscribe button
- Stores email in your newsletter service
- Sends weekly digest of new content

### 4.3 Analytics & Insights

#### 4.3.1 Page Views & Traffic
**What**: Track which plays/sections are most popular.

**Tech**: Plausible, Fathom, or custom analytics
- Privacy-first (no cookies)
- Shows dashboard: views, bounce rate, referrers

**Use**: Guides content creation (double down on popular topics)

#### 4.3.2 Search Analytics
**What**: Track what people are searching for.

**Tech**: Log search queries (anonymously)
- Shows: most searched terms, no results found, etc.
- Guides documentation improvements

#### 4.3.3 User Behavior Heatmaps (Optional)
**What**: Visual heatmap of where users click and scroll.

**Tech**: Hotjar, Microsoft Clarity (free tier)
- Shows which buttons are clickable, which aren't
- Guides UX improvements

### 4.4 Performance Optimization

#### 4.4.1 Image Optimization
**What**: Use modern formats (WebP), lazy loading, responsive images.

**Tech**: Next.js `<Image>` component (automatic)
- Automatic WebP/AVIF conversion
- Responsive sizing
- Lazy loading
- Prevents CLS

#### 4.4.2 Code Splitting
**What**: Only load JavaScript needed for current page/section.

**Tech**: Next.js dynamic imports
```javascript
const ExpensiveComponent = dynamic(() => import('./ExpensiveComponent'));
```

#### 4.4.3 Caching Strategy
**What**: Aggressive caching for static assets, stale-while-revalidate for dynamic content.

**Tech**: CDN caching headers + Next.js ISR (Incremental Static Regeneration)

#### 4.4.4 Core Web Vitals Targeting
**Goal**: Achieve optimal Core Web Vitals scores:
- LCP (Largest Contentful Paint): < 2.5s (target: < 1.5s)
- FID (First Input Delay): < 100ms (target: < 50ms)
- CLS (Cumulative Layout Shift): < 0.1 (target: < 0.05)

**Tools**:
- Chrome DevTools Lighthouse
- PageSpeed Insights
- WebVitals monitoring (Vercel)

### 4.5 Monetization & Scaling

#### 4.5.1 Sponsorship Opportunities
**What**: Subtle sponsor badges on popular pages.

**Options**:
- Tool/service sponsorships (e.g., "This play uses X tool")
- Blog sponsor (ethical ads from relevant companies)
- No pop-ups or intrusive ads

**Visual**: Small badge in footer or sidebar

#### 4.5.2 Premium Content (Future)
**What**: Gated content (optional premium tier).

**Options**:
- Free tier: public plays + docs
- Premium tier: advanced plays, exclusive workflows, early access
- Powered by Stripe (naturally!)

**Implementation**: Not necessary for MVP, plan for future

#### 4.5.3 API for Third Parties
**What**: Allow other products/tools to embed Martin content.

**Example**: "Here are plays from Martin system, find one that matches your workflow"

**Tech**: REST API or GraphQL endpoint
- Rate limited
- Free tier + paid tier
- Documentation for developers

### 4.6 Team & Collaboration

#### 4.6.1 Admin Panel
**What**: Non-technical interface to manage content (add/edit plays, etc.).

**Tech**: Headless CMS admin (Strapi, Sanity, etc.)
- Invite collaborators
- Approve changes
- Schedule publishing

#### 4.6.2 Collaborative Editing
**What**: Multiple people can suggest edits to plays/docs.

**Tech**: GitHub PRs (already built-in) or CMS workflow
- Suggest edit button on each page
- Opens GitHub issue / CMS workflow
- Collaborator reviews & merges

#### 4.6.3 Version Control
**What**: Archive old versions, show change history.

**Tech**: Git (already done!) or CMS versioning
- "View version history" button
- See what changed + when
- Revert to old version if needed

### 4.7 Brand & Polish

#### 4.7.1 Custom Illustrations
**What**: Branded illustrations for each major section.

**Style**: Minimal, technical, matches aesthetic

**Tool**: Figma, Illustrator, or AI generation (Midjourney, Stable Diffusion)

**Scope**: 3-5 key illustrations (hero, system overview, error states, etc.)

#### 4.7.2 Animation Library
**What**: Document all animations in a publicly available library.

**URL**: `/animations` or `/components`

**Benefit**: Shows off the design system, helps others learn

#### 4.7.3 Responsive Typography
**What**: Improve typography scaling across all breakpoints.

**Tech**: CSS `clamp()` function
```css
h1 {
  font-size: clamp(24px, 5vw, 48px);
}
```

#### 4.7.4 Dark Mode Enhancements
**What**: Perfect dark mode with carefully chosen contrast ratios.

**Enhancements**:
- True black background (for OLED screens)
- Reduced eye strain
- Optional high-contrast mode for a11y

### 4.8 SEO & Discovery

#### 4.8.1 Content Marketing Blog
**What**: Publish essays/case studies on system design, productivity, ops.

**Format**: 800-2000 word posts on topics related to Martin

**Goal**: Drive organic traffic, establish thought leadership

#### 4.8.2 Social Media Presence
**What**: Cross-post content to Twitter, LinkedIn, Hacker News.

**Strategy**: Not spammy, share insights + tools

#### 4.8.3 Structured Data Markup
**What**: Add JSON-LD for breadcrumbs, FAQs, articles.

**Benefit**: Rich snippets in search results, improves CTR

#### 4.8.4 OpenGraph & Twitter Card Optimization
**What**: Perfect social share previews.

**Include**: 
- Og:image (high-res preview image)
- Og:description (catchy summary)
- Og:title (optimized for social)
- Twitter:card (premium card format)

### Timeline
- **Q2 2027**: Advanced animations + direction-aware effects (3-4 weeks)
- **Q3 2027**: Community features + ratings/comments (3-4 weeks)
- **Q3 2027**: Analytics integration (1-2 weeks)
- **Q4 2027**: Performance optimization + Core Web Vitals targeting (2-3 weeks)
- **Q4 2027**: Brand polish + illustrations (2-3 weeks)
- **Q4 2027**: Final QA + launch 2.0 (1-2 weeks)

### Deliverables
- ✅ Advanced animations (parallax, cursor tracking, transitions)
- ✅ Community features (ratings, comments, attribution)
- ✅ Analytics dashboard
- ✅ Core Web Vitals optimized (LCP < 1.5s, FID < 50ms, CLS < 0.05)
- ✅ SEO optimizations (structured data, rich snippets)
- ✅ Custom illustrations for key sections
- ✅ Admin panel for content management
- ✅ Monetization strategy (sponsorships, premium tier)
- ✅ Public animations/components library
- ✅ Lighthouse 95+ score maintained
- ✅ WCAG 2.1 AAA compliance (exceeds standard)

---

## 📊 Milestones Summary

| Phase | Timeline | Key Deliverables | Tech | Status |
|-------|----------|------------------|------|--------|
| **Phase 1: Static Launch** | Q1 2026 (8 weeks) | HTML/CSS site, WCAG AA, Lighthouse 90+ | Vanilla HTML/CSS/JS | 🎯 Current |
| **Phase 2: Interactive Polish** | Q2-Q3 2026 (8 weeks) | Animations, micro-interactions, polish | CSS + Vanilla JS | 📅 Planned |
| **Phase 3: Dynamic Content** | Q4 2026 - Q1 2027 (8 weeks) | Next.js, CMS, search, personalization | Next.js + Node.js | 📅 Planned |
| **Phase 4: Premium Experience** | Q2-Q4 2027 (12 weeks) | Advanced features, monetization, AAA compliance | Next.js + React | 📅 Planned |

---

## 🛠️ Architecture Evolution

### Phase 1 → Phase 2
**No changes to architecture**. All animations added via CSS and vanilla JS.

### Phase 2 → Phase 3
**Migrate to Next.js**:
- Reuse all CSS tokens, design system
- Add React components on top
- No visual changes (same design)
- Just adds capability

### Phase 3 → Phase 4
**Add services**:
- CMS or headless backend (Sanity, Strapi)
- Analytics (Plausible, Fathom)
- Comments (GitHub Discussions or Discourse)
- Email (Mailchimp, ConvertKit)

**Still same look & feel**, just more powerful under the hood.

---

## 💡 Key Decision Points

### Decision 1: Framework Migration Timing
**Q**: When to migrate Phase 1 → Phase 2 (HTML → Next.js)?

**Options**:
- **A**: After Phase 1 ships (Q1 2026) - quick turnaround
- **B**: After Phase 2 ships (Q3 2026) - prove value first
- **C**: After Phase 3 ships (Q1 2027) - stable platform

**Recommendation**: Option B
- Validate Phase 2 animations work in HTML/CSS
- Prove they're valuable to visitors
- Then migrate to React for easier maintenance

### Decision 2: CMS Choice
**Q**: What CMS for Phase 3?

**Options**:
- **A**: Markdown in GitHub (free, simple)
- **B**: Contentful (professional, pricey)
- **C**: Sanity (flexible, developer-friendly)
- **D**: Strapi (open-source, self-hosted)

**Recommendation**: Option A for Phase 3
- No external dependencies
- Free forever
- Integrates with existing GitHub workflow
- Migrate to Option C (Sanity) in Phase 4 if team grows

### Decision 3: Monetization Model
**Q**: How to monetize Phase 4?

**Options**:
- **A**: Sponsorships only (ethical)
- **B**: Premium tier (content gating)
- **C**: Consulting/services (off-site)
- **D**: No monetization (passion project)

**Recommendation**: Option A + C
- Sponsorships keep site free + valuable
- Consulting (for implementation of Martin system) is the real value
- Premium tier too early (content still niche)

---

## 🚀 Go-Live Strategy

### Phase 1 (Q1 2026)
1. **Soft launch**: Share with close circle, collect feedback
2. **Bug fixes**: 1-2 weeks of iteration
3. **Public launch**: Announce on Twitter, ProductHunt, etc.
4. **Monitor**: Lighthouse, Core Web Vitals, user feedback

### Phase 2 (Q2-Q3 2026)
1. **Staged rollout**: Deploy animations to 10% of traffic first
2. **A/B test**: Compare engagement metrics (did animations help?)
3. **Full rollout**: If positive, deploy to 100%
4. **Iterate**: Collect feedback, refine

### Phase 3 (Q4 2026 - Q1 2027)
1. **Beta**: Offer early access to interested users
2. **Gather feedback**: What content do they want? Search working well?
3. **Iterate**: Add missing features
4. **Launch**: New architecture with dynamic content

### Phase 4 (Q2-Q4 2027)
1. **Announce**: "Martin 2.0" overhaul
2. **Show off**: Blog post on engineering, design, philosophy
3. **Celebrate**: It's a showcase site—treat it like a product launch

---

## 📚 Resources & Inspiration

### Design & Animation Inspiration
- **Stripe**: stripe.com (horizontal stripes, direction-aware hover)
- **Vercel**: vercel.com (clean, minimal, scroll interactions)
- **Cursor**: cursor.com (focus on functionality, design supports it)
- **Framer**: framer.com (animation playground, advanced effects)

### Tech & Tools
- **Framer Motion**: React animation library (Phase 3+)
- **Tailwind CSS**: Utility CSS framework (optional, Phase 3+)
- **shadcn/ui**: Accessible React components (optional, Phase 3+)
- **TurboRepo**: Monorepo management (if project scales)

### Learning
- **Web.dev**: Performance, accessibility, web standards
- **Vercel Web Interface Guidelines**: https://vercel.com/design/guidelines
- **Stripe Blog**: Case studies on design, engineering, culture
- **Cursor Docs**: Great examples of developer-focused design

---

## 📝 Conclusion

This 18-month roadmap transforms Martin from a clean documentation site to a premium interactive experience. Each phase builds incrementally—no big rewrites, no tech debt.

**Key Principle**: **Ship early, iterate often, let design guide the journey.**

By Q4 2027, Martin will be a **best-in-class showcase** of what a personal operating system can be—and the website will reflect that caliber of thinking.

---

**Ready to discuss tradeoffs, timelines, or specific tech decisions? This roadmap is a living document.**
