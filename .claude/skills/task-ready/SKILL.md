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

The `Step` column must match the selected workflow's ordered steps so the report reads as a direct contract check, not a generic summary. Keep the workflow order. If a step was not needed, mark it `skipped` and say why.

Use the template that matches the selected workflow.

### Standard (`.claude/workflows/standard.md`)

| Step | Skill or Subagent | Status | Evidence / Notes |
|---|---|---|---|
| 1. Ensure an active bead | `work-with-beads` | completed \| skipped \| blocked | active bead ID, or why bead flow did not apply |
| 2. State a short inline plan | local implementation | completed \| skipped \| blocked | brief plan summary |
| 3. Implement directly, or delegate to `code-writer` subagent | local implementation or `code-writer` | completed \| skipped \| blocked | changed files or delegation summary |
| 4. Follow the relevant source of truth | relevant workflow / skill / convention docs | completed \| skipped \| blocked | which source was followed, or why not needed |
| 5. Run validation via `validate` | `validate` | completed \| skipped \| blocked | commands run and pass/fail/skipped |
| 6. Run `review-automation-code` | `review-automation-code` or `n/a` | completed \| skipped \| blocked | findings summary or explicit reason not needed |
| 7. Run `task-ready` | `task-ready` | completed \| skipped \| blocked | checklist outcome and any exceptions |
| 8. Report per `task-ready §Reporting Format` | local implementation | completed | final risks, assumptions, and out-of-scope issues |

### High Risk (`.claude/workflows/high-risk.md`)

| Step | Skill or Subagent | Status | Evidence / Notes |
|---|---|---|---|
| 1. Ensure an active bead | `work-with-beads` | completed \| skipped \| blocked | active bead ID, or why bead flow did not apply |
| 2. Run `architect` subagent | `architect` | completed \| skipped \| blocked | plan file path or blocker |
| 3. Follow `refactor` TDD and protect shared behavior first | `refactor` | completed \| skipped \| blocked | protecting test added/updated, or why not applicable |
| 4. Run `code-writer` subagent to implement in order | `code-writer` | completed \| skipped \| blocked | implementation summary and validation ownership |
| 5. Collect the real changed-file list and diff | local implementation | completed \| skipped \| blocked | changed files / diff basis |
| 6. Run `code-reviewer` subagent against the diff | `code-reviewer` | completed \| skipped \| blocked | findings summary or no findings |
| 7. Apply the review loop rule | `code-writer` / `code-reviewer` or `n/a` | completed \| skipped \| blocked | loop count, findings severity, or why no loop was needed |
| 8. Run `task-ready` | `task-ready` | completed \| skipped \| blocked | checklist outcome and any exceptions |
| 9. Run `writer` subagent if public usage or docs changed | `writer` or `n/a` | completed \| skipped \| blocked | docs updated, or explicit reason not needed |

### Cross-Cutting (`.claude/workflows/cross-cutting.md`)

| Step | Skill or Subagent | Status | Evidence / Notes |
|---|---|---|---|
| 1. Ensure an active epic | `work-with-beads` | completed \| skipped \| blocked | epic ID and child structure, or blocker |
| 2. Run `architect` subagent | `architect` | completed \| skipped \| blocked | plan file path and covered areas |
| 3. Apply `refactor` TDD to each framework-level phase | `refactor` | completed \| skipped \| blocked | phase-by-phase protecting test status |
| 4. Run `code-writer` subagent phase-by-phase | `code-writer` | completed \| skipped \| blocked | phases implemented and validation gates |
| 5. Run `code-reviewer` subagent after each shared-behavior phase | `code-reviewer` | completed \| skipped \| blocked | review coverage and findings summary |
| 6. Apply the review loop rule | `code-writer` / `code-reviewer` or `n/a` | completed \| skipped \| blocked | loop count, findings severity, or why no loop was needed |
| 7. Run `writer` subagent | `writer` | completed \| skipped \| blocked | docs updated or blocker |
| 8. Run `task-ready` | `task-ready` | completed \| skipped \| blocked | checklist outcome and any exceptions |

Sub-workflows may add rows (for example `repair-test.md` may add failure-mode or re-run details), but the parent workflow rows stay in place and in order.
