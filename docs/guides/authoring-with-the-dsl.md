# Authoring With The DSL

Use this guide when adding pages, components, browser specs, or assertion coverage in this repository.

## File layout

| Concern | Location | Reference example |
|---|---|---|
| Navigable pages | `pages/` | `pages/HomePage.ts`, `pages/ProductsPage.ts`, `pages/ProductDetailsPage.ts` |
| Reusable scoped components | `pages/components/` | `pages/components/SiteHeaderComponent.ts`, `pages/components/ProductsCatalogComponent.ts` |
| App-level browser specs | `tests/ui/` | `tests/ui/home.spec.ts`, `tests/ui/products.spec.ts` |
| Browser-facing framework specs | `tests/framework/` | `tests/framework/assertions.spec.ts`, `tests/framework/fixture.spec.ts` |
| Framework/unit coverage | `tests/unit/` | `tests/unit/xLocator.spec.ts`, `tests/unit/eslintRules.spec.ts` |

## Pages

- Pages extend `xPage`, own a `readonly path`, and implement `isOpened()`.
- Page-owned locators are `readonly` field initializers created with `this.$(...)`.
- Nested reusable areas become component fields, not inheritance.
- Dynamic locators stay as methods that return `xLocator`.

`ProductsPage` shows the intended shape: page fields for page-owned controls, nested components for the header, brand sidebar, catalog, and footer, plus business actions such as `searchProducts()` and `openBrand()`.

## Components

- Components extend `xComponent` only and are constructed from a scoped root locator.
- Child locators are `readonly` fields created through `this.$(...)`.
- Parameterized locators are methods, not stored fields.
- Components never call `page.locator(...)` or hold a raw `Page`.

`ProductsCatalogComponent.cardByName(name)` is the reference pattern for parameterized product lookup. It keeps the search scoped to the component root and lets the spec stay at the level of user intent.

## Browser specs

- Prefer `framework/fixtures/app.fixture` for browser specs so shared fixtures and logger reset behavior stay consistent.
- Construct page objects near the top of the test and navigate with `pageObject.open()`.
- Route interactions through page and component APIs rather than raw `page.goto`, `page.locator`, or `page.getByRole`.
- Use `@ui` in browser-facing titles and `@unit` in framework tests.

`tests/ui/products.spec.ts` is the reference suite for:

- nested component interactions
- parameterized locators
- `softGroup(...)`
- assertion-helper usage in browser flows

## Assertion helpers

Prefer helpers from `assertions/` when one exists:

- visibility: `assertVisible`, `assertHidden`
- text and values: `assertTextEquals`, `assertTextContains`, `assertValueEquals`
- state: `assertEnabled`, `assertDisabled`, `assertChecked`, `assertUnchecked`
- structure: `assertCount`, `assertAttributeEquals`, `assertAttributePresent`
- URL and grouping: `assertUrl`, `softGroup`

Use raw `expect(...)` only when there is no helper for the assertion you need, such as comparing plain arrays or objects.

## Static guardrails

The repo-local ESLint plugin enforces the most important DSL boundaries:

- tests cannot use raw locator entry points
- navigation stays inside page objects
- components cannot reach for `page.locator(...)`
- concrete pages must implement `isOpened()`

Run `npx eslint .` before handoff so those boundaries fail locally instead of in review.
