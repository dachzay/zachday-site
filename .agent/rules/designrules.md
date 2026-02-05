---
trigger: always_on
---

This document extracts and formalizes the existing visual and interaction rules already present in the Martin website. It does not introduce new design direction. It names what already exists so it can be reused consistently.

1. Design Philosophy

Martin’s interface is designed to support deliberate thinking, not scanning or productivity theater.

Core principles:

Calm over clever

Density without clutter

Structure without decoration

Readability over expressiveness

The UI should feel:

Technical

Premium

Intentional

Slightly austere

2. Color System

Colors are semantic first, aesthetic second.

Core Tokens

Background: #0a0a0a

Used for page body and outer frame

Panel: #161616

Used for cards, content containers, grouped sections

Border / Divider: #262626

Minimal outlines and separators only

Primary Text: #e8eaf0

Long-form reading text

Secondary / Muted Text: lighter gray variants

Metadata, captions, breadcrumbs

Accent: #10b981

Used sparingly for emphasis, active states, and affordances

Rules:

Accent color should never dominate a page

Borders are preferred over shadows

Contrast must support long reading sessions

3. Typography
Font Stack

ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont

Hierarchy

H1: Page identity (e.g. Martin — Plays)

H2: Section grouping

H3: Subsections within a concept

Body: Default reading size, generous line height

Rules:

No decorative fonts

No extreme size jumps

Headings create rhythm, not spectacle

4. Layout & Spacing
Page Structure

Full-width background

Centered content column

Clear vertical stacking

Spacing Principles

Sections are separated by space, not lines

Cards and panels use consistent internal padding

Vertical rhythm is more important than horizontal complexity

Rules:

Avoid multi-column layouts for primary reading

Let sections breathe

5. Core Components
Header + Breadcrumb

Format: Martin — [Section]

Always visible at top of content

Anchors user context immediately

Pill Navigation

Rounded, contained links

Used for sibling navigation within a domain

Clear active state

Rules:

Pills represent categories, not actions

Keep count manageable (avoid overflow)

Cards

Used for lists (e.g. Plays index)

Contained within panel background

Clickable as a whole when possible

Rules:

Cards summarize, they do not explain fully

Consistent height where possible

6. Navigation Model
Global Mental Model

The site is divided into conceptual layers:

System = rules and constraints

Plays = repeatable workflows

Others (Metrics, Roadmap, etc.) = future-facing references

Rules:

Navigation reinforces hierarchy

Users should always know where they are

Depth is allowed, disorientation is not

Cross-Linking

System pages may reference Plays

Plays may reference System rules

Links should feel intentional, not encyclopedic

7. Content Density Rules

Prefer fewer pages with more substance

Avoid stubs that feel empty

Lists should communicate intent, not exhaustiveness

8. Mobile Responsiveness
Constraints

Reading remains primary use-case

Navigation must not overwhelm content

Rules:

Single-column layout

Pill navigation may wrap or scroll horizontally

No critical information hidden behind hover-only interactions

9. Explicit Non-Goals

The design system should not drift into:

Dashboard-style UI

Data visualization-heavy layouts

Animations for their own sake

Theme customization

10. Status

This document represents the current, extracted truth of the Martin website’s UX/UI system.

Future changes must be deliberate and reflected here before implementation.