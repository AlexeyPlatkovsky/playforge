---
name: review-automation-code
description: Review Playwright UI automation under `tests/ui/`, `tests/framework/`, `pages/`, and `components/` for DSL boundary violations, page/component design, locator hygiene, and assertion quality. Use after creating, editing, or refactoring Playwright page objects, components, or browser-facing specs.
---

# Review Automation Code

Review the changed automation code as a system, not file-by-file.

## Inputs

- Read the changed UI specs or framework browser specs and the pages/components they use.
- Read relevant fixtures, assertions, and support helpers when the change touches shared setup, URLs, or credentials.
- Source of truth:
  - `docs/conventions/page-objects.md`
  - `docs/conventions/components.md`
  - `docs/guides/authoring-with-the-dsl.md`
  - `write-test`
  - `task-ready`

## What To Flag

- **HIGH**: raw `page.locator`, `page.getByRole`, or `page.goto` in `tests/**`
- **HIGH**: raw `page.locator` in `components/**`
- **HIGH**: page modeled as or extending `xComponent`
- **HIGH**: raw `expect(...)` in tests when an assertion helper already exists
- **HIGH**: hardcoded credentials or secrets
- **MEDIUM**: missing `isOpened()` on a navigable page
- **MEDIUM**: parameterized locator stored as a field instead of a method
- **MEDIUM**: child locator assigned lazily in a way that breaks name binding
- **MEDIUM**: page/component APIs exposing low-level mechanics where a business action should exist
- **MEDIUM**: fragile locator where a stable id, data-testid, name, or scoped CSS option exists
- **LOW**: naming or minor readability issue

## What Not To Flag

- Personal style preferences that do not affect correctness or maintainability
- One-off local code when the abstraction cost is higher than the reuse benefit
- Requests to move test-only concerns into framework code without a clear reuse case

## Output Format

Report findings first, ordered by severity:

- `HIGH`
- `MEDIUM`
- `LOW`

For each finding include:

- file path
- concrete issue
- recommended direction

If there are no findings, state that explicitly and mention any residual risk briefly.

## Fix Loop

1. Review after the first implementation pass.
2. Fix HIGH and MEDIUM findings before calling the task complete.
3. Re-run the review if public page/component APIs changed materially.
