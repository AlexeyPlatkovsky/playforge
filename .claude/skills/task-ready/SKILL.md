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

## Notes

- If you cannot run a step, state it explicitly.
- Prefer the smallest relevant verification set first.
- Skills-only and docs-only changes may be review-only work.
