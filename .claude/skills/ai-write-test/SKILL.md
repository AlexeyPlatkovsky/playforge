---
name: ai-write-test
description: End-to-end orchestration skill for authoring, editing, or fixing Playwright tests and the page/component code they require. Use for new specs from a test case template or for targeted fixes to existing tests.
---

# ai-write-test Skill

Author new specs from a test case template, or edit/fix existing specs from a file path plus problem description. Browser automation is a discovery tool; final code must follow the local DSL conventions.

## Scope Constraints

- Write test specs under `tests/`.
- Add or update page/component code under `pages/` and `components/` when the scenario needs it.
- Do not edit `framework/` unless the task explicitly requires framework support.
- Keep raw locators and `page.goto` calls out of test specs.
- Prefer field-initialized child locators on pages/components and parameterized locator methods.

## Stage 1 - Parse And Clarify

Determine the mode:

- **New test**: infer feature name, starting page, auth requirement, scenario steps, and expected outcome from the provided case.
- **Edit/fix**: read the affected spec plus any touched pages/components first and confirm the problem from code.

Ask questions only when the starting point, auth state, or expected behavior is genuinely ambiguous after reading the provided material.

## Stage 2 - Plan

1. Walk the scenario from the entry point through each user-visible step.
2. List the touched pages and components.
3. Compare against `pages/` and `components/` to decide what can be reused.
4. Print a short plan listing files to create and update before broad edits.

## Stage 3 - DOM Capture

Skip this stage when all needed locators already exist and the issue is logic-only.

When discovery is needed, use the `playwright-cli` skill:

- Open the target page.
- If auth is required, read credentials from environment variables and save/load storage state with `auth.json`.
- Walk the scenario and capture snapshots under `.playwright/snapshots/`.
- Record stable selectors, dynamic timing risks, iframe/shadow boundaries, and any navigation points.

If the CLI cannot reach the page, ask for HTML or a representative snapshot instead of guessing selectors.

## Stage 4 - Implement

Implement in this order:

1. Page objects via `create-page-object`
2. Components via `create-component`
3. Test spec via `write-test`

Before validation, run `review-automation-code` for multi-file UI changes or any change that adds or reshapes page/component APIs.

## Stage 5 - Run And Repair

Validate in this order when the toolchain exists:

```bash
npx tsc --noEmit
npx playwright test tests/unit
npx playwright test <target-spec>
```

Repeat the repair loop up to 3 times. If it still fails, report the blocker, the last error, and the next recommended step.

## Stage 6 - Report

Before closing the task, run `task-ready`.

Report:

| Item | Detail |
|---|---|
| Files created | Paths |
| Files updated | Paths |
| Validation | Pass / Fail / Not run |
| Repair cycles | n of 3 |
| Framework gaps | Missing support in `framework/` if any |
