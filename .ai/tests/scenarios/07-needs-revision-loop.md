# Scenario 07 - Reviewer Returns Needs Revision, Developer Fixes

**Category:** Edge case
**Modes:** Offline

## Spec

> Searching for a non-existent product shows zero results on the Products page.

## Fixture Inputs

- EXPLORER OUTPUT: inject `fixtures/explorer-output-valid.md`
- DEVELOPER OUTPUT (first cycle): inject `fixtures/developer-output-lint-fail.md`

## Stage Sequence

**Cycle 1:**
1. Skip Stages 1 and 2. Feed Stage 3 (reviewer) with both fixtures.
2. Reviewer should return "Needs revision" citing the lint failure.

**Cycle 2:**
3. Feed Stage 2 (developer) with: the spec, the EXPLORER OUTPUT fixture, and the reviewer's findings from Cycle 1.
4. Developer fixes the DSL violation (removes raw locator, uses `productsPage.catalog`), runs typecheck and lint (both pass), produces a new DEVELOPER OUTPUT block with `npm run lint - passed` and `Browser verification - skipped (offline mode)`.
5. Feed Stage 3 (reviewer) with the Cycle 1 EXPLORER OUTPUT and the Cycle 2 DEVELOPER OUTPUT.
6. Reviewer should approve.

## Expected Outcome

- Cycle 1 reviewer verdict: **Needs revision** with at least one Blocking finding referencing the lint failure.
- Cycle 2 developer output: `npm run lint - passed`, `Browser verification - skipped (offline mode)`.
- Cycle 2 reviewer verdict: **Approve** or **Approve with minor fixes**.

## Disposable Changes

- Cycle 2 may modify `tests/ui/products.spec.ts`.

Cleanup requirement: restore any Cycle 2 file changes before recording the final result. If `tests/ui/products.spec.ts` has pre-existing uncommitted changes before the scenario, record `SKIP` with reason `dirty scenario target`. If cleanup cannot restore the pre-scenario worktree state without touching unrelated changes, record `FAIL`.

## Pass Criterion

Cycle 1 reviewer produces `Needs revision` with a Blocking finding. Cycle 2 reviewer produces `Approve` or `Approve with minor fixes`. The revision loop terminates in exactly two cycles. Cleanup must restore the pre-scenario worktree state.

## What a Failure Looks Like

Cycle 1 reviewer approves despite the lint failure. Cycle 2 developer fails lint again. Reviewer approves a non-passing handoff. The scenario leaves products-spec edits in the worktree after cleanup.
