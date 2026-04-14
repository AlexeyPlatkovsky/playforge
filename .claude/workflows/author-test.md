# Workflow: Author Test

Use when creating a new spec from a test case template, story, or scenario description. Covers new pages/components the scenario needs.

## Scope

- Spec under `tests/`
- Page/component code under `pages/` and `components/` when the scenario needs it
- Do not edit `framework/` unless the task explicitly requires framework support

## Steps

0. **Bead.** Ensure an active bead per `work-with-beads`.
1. **Parse the case.** Extract feature name, starting page, auth requirement, scenario steps, and expected outcome. Ask only when the entry point, auth state, or expected behavior is genuinely ambiguous after reading the case.
2. **Plan.** Walk the scenario from entry point through each user-visible step. List touched pages and components. Compare against `pages/` and `components/` to decide what to reuse vs add. Print a short plan (files to create / update) before broad edits.
3. **DOM capture (skip if all locators exist).** Use the `playwright-cli` skill: open the target page, save/load `auth.json` if auth is required (read credentials from env), walk the scenario, capture snapshots under `.playwright/snapshots/`. Record stable selectors, dynamic timing risks, iframe/shadow boundaries, navigation points. If the CLI cannot reach the page, ask for HTML rather than guessing selectors.
4. **Implement.** In this order, following the linked sources of truth:
   - Page objects → `docs/conventions/page-objects.md`
   - Components → `docs/conventions/components.md`
   - Test spec → `write-test`
5. **Self-review.** Run `review-automation-code` for multi-file UI changes or any change that adds/reshapes page or component APIs.
6. **Validate.** Use `validate` to pick commands. Repeat the repair loop up to 3 times. If still failing, report blocker, last error, recommended next step.
7. **Task ready.** Run `task-ready` and report per its `§Reporting Format`.

## Escalate

- Touches `framework/core/**`, fixtures, reporting, ESLint rules, or `assertions/soft.ts` → escalate to `high-risk.md`.

## Do Not

- Put raw `page.goto`, `page.locator`, or `page.getByRole` in specs.
- Store parameterized locators as fields. Use methods.
- Hardcode credentials.
- Add framework support speculatively while authoring a single spec.
