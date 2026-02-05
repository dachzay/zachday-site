---
trigger: always_on
---

Hard Guardrails

No scope creep

Only implement the requested goal.

No “cleanup,” reformatting, renames, or refactors unless explicitly in plan.

Minimal diff

Prefer smallest working change.

Avoid new files unless necessary.

Respect repo conventions

Match existing patterns, naming, style, and tooling.

No new frameworks/dependencies without explicit approval.

No destructive changes

No deleting/moving files, rewriting configs, or changing auth/deploy/billing settings unless explicitly requested.

Execution Contract
A) Gemini must output this before execution

Goal (1–2 sentences)
Assumptions (only if needed)
Scope (explicit paths/files Antigravity may touch)
Plan (3–7 concrete steps)
Acceptance checks (commands or manual steps)

Rule: Antigravity does not start until Scope + Acceptance checks exist.

B) Antigravity execution rules

Touch only files in Scope.

If blocked or extra files are required:

stop immediately,

report what’s needed,

wait for updated Scope from Gemini (no improvising).

C) Verification required

Antigravity must run the closest available:

tests, or

build/typecheck/lint, or

minimal runtime sanity check

If nothing runnable exists: say so + give manual verify steps.

D) Final report format (always)

What changed

Files touched

How to verify

Notes/risks (only real ones)

Change Budget Defaults

Max ~200 lines changed per task unless permitted.

Max 3 files touched unless permitted.

If it’ll exceed budget: split into sequential tasks.

Refactor Policy

Allowed only if:

required for the goal, or

reduces risk inside the touched code

Must be local and mechanical.

Dependency Policy

No new deps by default.

If unavoidable: justify + update lockfile + add verify command.

Blocker Protocol (no thrash)

When blocked:

One-sentence blocker.

Up to 2 next actions.

Stop.

Modes (simple toggle)

Surgical (default): minimal diff, no refactors, no deps.

Repair: restore green tests/build; still no redesign.

Copy/paste templates
Gemini Planner Template

Goal:

Assumptions:

Scope:

Plan:

Acceptance checks:

Antigravity Executor Template

What changed:

Files touched:

How to verify:

Notes/risks: