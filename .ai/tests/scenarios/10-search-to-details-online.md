# Scenario 10 - Search Result Opens Product Details

**Category:** Online complexity
**Modes:** Online

## Spec

> Searching for "Blue Top" on the Products page lets the user open the product details page and verify structured product information.

## Fixture Inputs

None - run all three stages with live AI execution.

## Stage Sequence

1. **Stage 1 - Explorer**: receives the spec. Scans `pages/`, `pages/components/`, `tests/ui/`, `assertions/`, and `framework/fixtures/`. Produces EXPLORER OUTPUT that identifies reusable Products and Product Details page objects.
2. **Stage 2 - Developer**: receives the spec + EXPLORER OUTPUT. Adds a disposable test to `tests/ui/products.spec.ts`. Runs `npm run typecheck`, `npm run lint`, and `npm run test:ui`. Produces DEVELOPER OUTPUT.
3. **Stage 3 - Reviewer**: receives both blocks. Evaluates the multi-step flow for DSL compliance, selector quality, and reuse.

## Expected Outcome

- Explorer identifies `pages/ProductsPage.ts`, `pages/ProductDetailsPage.ts`, `pages/components/ProductsCatalogComponent.ts`, `pages/components/ProductInformationComponent.ts`, `tests/ui/products.spec.ts`, and applicable assertion helpers.
- Developer adds a test to `tests/ui/products.spec.ts` only.
- Test uses `ProductsPage.searchProducts`, `ProductsPage.openProductDetails`, `ProductDetailsPage.isOpened`, and assertion helpers.
- Test asserts URL/search state before opening details and validates name, category, price, availability, condition, and brand on the details page.
- No raw Playwright locators appear in the test body.
- Typecheck, lint, and browser verification pass.
- Reviewer verdict: **Approve** or **Approve with minor fixes**.

## Disposable Changes

- `tests/ui/products.spec.ts` may be modified by the scenario.

Cleanup requirement: restore `tests/ui/products.spec.ts` to its pre-scenario state before recording the final result. If `tests/ui/products.spec.ts` has pre-existing uncommitted changes before the scenario, record `SKIP` with reason `dirty scenario target`. If cleanup cannot restore the pre-scenario worktree state without touching unrelated changes, record `FAIL`.

## Pass Criterion

Reviewer verdict is `Approve` or `Approve with minor fixes` AND the changed file is `tests/ui/products.spec.ts` AND the DEVELOPER OUTPUT block shows `npm run typecheck - passed`, `npm run lint - passed`, and `npm run test:ui - passed` / `Browser verification - passed`. Cleanup must restore the pre-scenario worktree state.

## What a Failure Looks Like

Explorer misses the existing Product Details page object. Developer duplicates page objects, uses raw locators in the test, or omits browser verification. The scenario leaves products-spec edits in the worktree after cleanup.

