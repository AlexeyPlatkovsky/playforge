---
name: task-ready
description: Task completion checklist. Run before declaring work done or handing off for review.
---

Work through each item in order. Stop and fix before moving on if any step fails.

## Checklist

- [ ] **Validation scope selected**: use `validate`
- [ ] **Selected verification passes**: run the chosen checks or explain why they could not run
- [ ] **Automation design review**: if `pages/`, `pages/components/`, `tests/ui/`, or `tests/framework/` changed materially, run `review-automation-code`
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

Then present the completion report as a markdown table.

Required columns:

| Step | Skill or Subagent | Status | Evidence / Notes |
|---|---|---|---|

Rules:

- The `Step` rows must mirror the ordered steps from the selected workflow. Do not use a generic fixed row set.
- Different tasks may require different rows. The report should reflect the actual chosen workflow and any relevant sub-workflow.
- Keep the workflow order so the report reads as a contract check.
- If a workflow step was not needed, include it and mark it `skipped` with the reason.
- If a sub-workflow adds task-specific requirements, add rows for those steps too.
