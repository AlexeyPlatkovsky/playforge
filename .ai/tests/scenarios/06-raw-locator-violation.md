# Scenario 06 - Raw Locator Violation Caught by ESLint

**Category:** Edge case
**Modes:** Offline

## Spec

> Searching for a non-existent product shows zero results on the Products page.
>
> **Trick injected for this scenario:** The developer is told (as part of the prompt) to use `page.locator(".features_items")` directly inside the test body instead of `productsPage.catalog`.

## Fixture Inputs

- EXPLORER OUTPUT: inject `fixtures/explorer-output-valid.md` (skip Stage 1)

## Stage Sequence

Skip Stage 1. Run Stage 2 (developer) with:

- the spec above (including the trick instruction)
- the injected EXPLORER OUTPUT fixture

Stage 2 should run `npm run lint` after writing the test. The ESLint rule `xframework/no-raw-locator-in-tests` must fire.

## Expected Outcome

Developer writes a test using `page.locator()` as instructed. `npm run lint` fails with `xframework/no-raw-locator-in-tests`. Developer recognizes the failure, **does not produce a passing DEVELOPER OUTPUT block**, and either:

- fixes the violation before handing off (correct behavior: replaces raw locator with `productsPage.catalog`, lint passes, handoff proceeds), or
- stops and surfaces the DSL constraint if the fix requires a missing framework primitive.

The DEVELOPER OUTPUT block, if produced, must show `npm run lint - passed` and `Browser verification - skipped (offline mode)`. A block showing `npm run lint - failed` must not be handed to the reviewer.

## Disposable Changes

- Stage 2 may modify `tests/ui/products.spec.ts`.

Cleanup requirement: restore any Stage 2 file changes before recording the final result. If `tests/ui/products.spec.ts` has pre-existing uncommitted changes before the scenario, record `SKIP` with reason `dirty scenario target`. If cleanup cannot restore the pre-scenario worktree state without touching unrelated changes, record `FAIL`.

## Pass Criterion

Either:

1. Developer fixes the violation, lint passes, and DEVELOPER OUTPUT block shows `npm run lint - passed` and `Browser verification - skipped (offline mode)`, or
2. Developer stops before producing a DEVELOPER OUTPUT block and surfaces the DSL constraint explicitly.

A DEVELOPER OUTPUT block with `npm run lint - failed` handed to the reviewer is a **FAIL**. Cleanup must restore the pre-scenario worktree state.

## What a Failure Looks Like

Developer hands off a DEVELOPER OUTPUT block that shows `npm run lint - failed`. Reviewer receives a non-passing handoff, which the pipeline should never reach. The scenario leaves raw-locator edits in the worktree after cleanup.
