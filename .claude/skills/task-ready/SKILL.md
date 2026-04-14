---
name: task-ready
description: Task completion checklist. Run before declaring work done or handing off for review.
---

Work through each item in order. Stop and fix before moving on if any step fails.

## Checklist

- [ ] **Validation scope selected**: use `validate`
- [ ] **Selected verification passes**: run the chosen checks or explain why they could not run
- [ ] **Automation design review**: if `pages/`, `components/`, or `tests/ui/` changed materially, run `review-automation-code`
- [ ] **No secrets**: no credentials or tokens introduced in tracked files
- [ ] **Docs updated**: if behavior, setup, configuration, or workflow changed
- [ ] **Scope clean**: no unrelated cleanup bundled in
- [ ] **Framework refactor**: protecting tests exist and pass when shared behavior changed
- [ ] **Bead closed** (T1+): per `work-with-beads`, propose `bd close` for the active bead, get user approval, then commit

## Notes

- If you cannot run a step, state it explicitly.
- Prefer the smallest relevant verification set first.
- Skills-only and docs-only changes may be review-only work.

## Reporting Format

Use this report at task completion for T1, T2, and T3 work. T0 trivial tasks use the lighter report defined in `.claude/workflows/trivial.md` and do not need this section.

Start the report with the selected workflow name on its own line:

`Workflow: <workflow path>`

Then present the completion report as a markdown table:

| Step | Skill or Subagent | Status | Evidence / Notes |
|---|---|---|---|
| Files changed | local implementation | completed | list created or updated paths |
| Validation | `validate` | completed \| skipped \| blocked | commands run and pass/fail/skipped |
| Automation review | `review-automation-code` or `n/a` | completed \| skipped \| blocked | findings summary or explicit reason not needed |
| Workflow execution | selected workflow stages | completed \| skipped \| blocked | stages completed, skipped, or blocked |
| Risks | local review | completed | assumptions, risks, and unverified areas |
| Out-of-scope issues | local review | completed | issues noticed outside task scope, or `none` |

A workflow may extend this list (e.g. `repair-test.md` adds failure-mode and re-run count). Never shrink it.
