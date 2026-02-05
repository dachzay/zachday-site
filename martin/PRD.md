# Martin Website — Product Requirements Document (PRD)

## 1. Purpose

The Martin website is a personal operating system rendered as a static website. Its purpose is to externalize thinking, structure decision-making, and make complex systems legible over time.

This PRD defines the design, UX, and content architecture requirements for the Martin website. It does not describe backend systems, execution engines, or tooling. The site is treated as a finished interface, not a prototype for future software.

## 2. Product Goals

The Martin website must:

- Make complex ideas navigable without oversimplification
- Preserve calm, focused reading over time
- Encode hierarchy and intent visually
- Allow the system to grow without visual or conceptual drift

Success is defined by:

- A new page feeling inevitable, not custom
- A reader always knowing where they are and why
- The site remaining coherent as sections expand

## 3. Target User

The primary user is the author.

Secondary users may include:
- Collaborators
- Future maintainers
- Readers attempting to understand the system

The site optimizes for clarity to a thoughtful reader, not speed, virality, or scanning behavior.

## 4. Information Architecture

The site is organized into distinct conceptual layers. Each layer has a clear purpose and boundary.

### Core Sections

**Overview (`/martin/`)**
- High-level orientation
- Explains what Martin is and how to approach it

**System (`/martin/system/`)**
- The kernel of the operating system
- Rules, constraints, protocols, and validation logic
- Answers: “What must always be true?”

**Plays (`/martin/plays/`)**
- Repeatable workflows and thinking patterns
- Applied, situational, and practical
- Answers: “What do I do in this situation?”

### Future-Facing Sections

**Innovations, Metrics, Standards, Roadmap**
- May begin as sparse but must remain structurally consistent

### Rules:
- Content belongs in **System** if it constrains behavior
- Content belongs in **Plays** if it prescribes action
- Sections should deepen, not multiply

## 5. Navigation & UX Requirements

### Global Navigation
Every page must clearly indicate:
- The Martin identity
- The current section
- **Breadcrumb format is mandatory**: `Martin — [Section]`

### Local Navigation
- **Pill-style sub-navigation** is used within sections
- Pills represent sibling pages within a domain
- Active state must be visually distinct

### Navigation Principles
- Depth is allowed; disorientation is not
- Users should never feel “lost” inside the system
- Navigation reinforces conceptual hierarchy

## 6. Content Templates

### System Page Template
A System page must include:
- Clear conceptual title
- Definition or principle
- Constraints or rules
- Optional cross-references to Plays

System pages prioritize: **Precision, Stability, Long-term truth**

### Play Page Template
A Play page must include:
- Name and intent
- When to use it
- Preconditions or context
- Step-by-step structure
- Completion or validation criteria

Plays prioritize: **Practical clarity, Reusability, Situational judgment**

### Index Pages
Index pages (e.g. Plays index) must:
- Use card layouts
- Summarize intent, not content
- Invite exploration without overwhelming

## 7. Visual & Design Requirements

The website must conform to the **Martin UX/UI Design System** document (`designrules.md`), which serves as the authoritative source for:
- Color tokens
- Typography
- Spacing
- Components
- Responsiveness rules

This PRD does not redefine visual rules; it enforces their use.

## 8. Responsiveness

The site must remain fully usable on mobile devices.

Requirements:
- Single-column reading layout
- Navigation remains accessible but unobtrusive
- No critical information hidden behind hover-only interactions

Mobile is treated as a reading surface, not a reduced experience.

## 9. Content Growth Rules

As the site evolves:
- New pages must conform to existing templates
- New sections must justify their conceptual role
- Visual consistency outweighs novelty
- The system should feel composed, not accumulated.

## 10. Non-Goals

The Martin website will not:
- Become a dashboard or app-like interface
- Implement interactive execution or automation
- Optimize for engagement metrics
- Introduce personalization or theming

## 11. Open Design Questions

The following are intentionally unresolved:
- How dense future sections (Metrics, Standards) should become
- Whether some System concepts should eventually collapse into fewer pages
- How much cross-linking is “too much” before cognitive load increases

These decisions should be revisited only when real usage pressure exists.

## 12. Status

This PRD defines the current, intended shape of the Martin website.
Changes to structure, navigation, or visual language should update this document before implementation.
