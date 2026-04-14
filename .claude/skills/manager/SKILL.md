---
name: manager
description: Routes a task through the project's orchestration tiers. Use at the start of any non-trivial request to classify risk and pick the workflow. Outputs a tier decision and points to the matching `.claude/workflows/` file.
---

# Manager Skill

Routing only. This skill selects a workflow. It does not define rules, steps, or skill internals.

## Inputs

- The user request
- `AGENTS.md` classification and risk model
- Current repo state if it affects tiering

## Decision

Pick exactly one tier using `AGENTS.md §Task Classification`.

| Tier | Workflow |
|---|---|
| T0 trivial + low risk | `.claude/workflows/trivial.md` |
| T1 non-trivial + low/medium risk | `.claude/workflows/standard.md` |
| T2 non-trivial + high risk | `.claude/workflows/high-risk.md` |
| T3 cross-cutting / architectural | `.claude/workflows/cross-cutting.md` |

## Output

Before starting work, state in one line:

`Tier: T<n> · Workflow: <file> · Reason: <one sentence>`

Then:

- **T1 / T2 / T3** — run `work-with-beads` before the workflow body to ensure an active bead exists.
- **T0** — proceed straight to the workflow. No bead.

Do not restate workflow or bead procedure here.

## Rules

- Do not pick a heavier tier to be safe; pick the one that matches the risk model.
- Escalate tier only when new information during execution changes the risk profile.
- Never spawn a subagent outside the selected workflow's contract.
- Never redefine rules that already live in `AGENTS.md` or a skill.
