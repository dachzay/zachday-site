# Agent Handoff: Martin Website Design

## 📅 Date
2026-01-14

## 🎯 Primary Goal
**Build a Product Requirements Document (PRD) for the Martin Website Design.**
The focus is on the **visual architecture, user experience, and content structure** of the "Martin" personal operating system website.
*Correction*: This is **NOT** about implementing backend execution or running Python scripts (`skills-ref`). The goal is strictly the design and frontend implementation of the site.

## 📂 Current Implementation State
The project is a static HTML/CSS website located in `c:\Users\ZachDay\Desktop\website`.

### 1. Design System
- **Aesthetic**: Premium, dark-mode technical documentation style.
- **Palette**: `bg: #0a0a0a`, `panel: #161616`, `text: #e8eaf0`, `accent: #10b981`.
- **Typography**: `ui-sans-serif`, clean and readable.
- **Components**:
  - "Pill" styled sub-navigation.
  - Consistent header with breadcrumbs (`Martin — [Section]`).
  - Card layouts for lists (e.g., in `/plays`).

### 2. Site Architecture
The site is organized into specific domain "layers":
- **`/martin/index.html`**: Main Overview.
- **`/martin/system/`**: The "Kernel" (Rules, Context, Protocols).
- **`/martin/plays/`**: Repeatable workflows (e.g., *Champion Development*).
- **`/martin/innovations/`**: (Stubbed) New ideas.
- **`/martin/metrics/`**: (Stubbed) Key performance indicators.
- **`/martin/standards/`**: (Stubbed) Quality bars.
- **`/martin/roadmap/`**: (Stubbed) Future plans.

## 📝 Requirements for the PRD
The PRD should define:
1.  **UX/UI Standards**: Formalize the existing style (spacing, typography, color tokens).
2.  **Navigation Flow**: detailed interaction expectations for moving between "System" views and "Play" views.
3.  **Content Templates**: Structure for future pages (e.g., "How to format a standard 'Play' page").
4.  **Mobile Responsiveness**: ensure the complex navigation scales down effectively.

## ⚠️ Notes for Next Agent
- **Ignore** backend/execution context regarding `skills-ref` for now; treat it only as potential potential *content* to be documented, not functionality to be built.
- The user is focused on **frontend design** and **information architecture**.
- Use existing pages (`plays/index.html`, `system/*.html`) as the source of truth for the current visual identity.
