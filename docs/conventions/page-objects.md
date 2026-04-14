# Page Object Conventions

Reference for any code that creates or edits page objects.

## Location

Page objects live in `pages/`. One class per navigable page.

## Choose The Right Shape

1. **Top-level page**: extends `xPage`, owns `readonly path`, implements `isOpened()`
2. **Page with components**: an `xPage` exposing `readonly` component fields
3. **Parameterized page helper**: a method returning `xLocator` for dynamic elements

Pages are never components and never extend `xComponent`.

## Template

```ts
import { expect } from '@playwright/test';
import { xPage } from '../framework/core/xPage';
import { SiteHeaderComponent } from './components/SiteHeaderComponent';

export class ProductsPage extends xPage {
  readonly path = '/products';
  readonly header = new SiteHeaderComponent(this.$('header'));
  readonly searchInput = this.$('#search_product');

  async isOpened(): Promise<void> {
    await expect(this.searchInput).toBeVisible();
  }
}
```

## DSL Rules

- Use `this.$('...')` for page-owned locators.
- Keep child locators as `readonly` field initializers.
- Model parameterized locators as methods returning `xLocator`.
- Tests never call `page.goto`, `page.locator`, or `page.getByRole`; the page owns navigation and selectors.
- Do not extend `xComponent`.

## Locator Priority

1. `id`
2. `data-testid`, `name`, or stable ARIA-backed attributes
3. Stable scoped CSS selectors
4. Text-heavy or structure-heavy selectors only as a last resort

Avoid fragile positional selectors and utility-class-only selectors.

## Behavior

- Every navigable page implements `isOpened()`.
- Assertions stay out of page objects except page-readiness checks inside `isOpened()`.
- Prefer business actions over low-level mechanics.
- Navigation methods may perform actions, but tests remain responsible for constructing destination pages unless the project standardizes otherwise.

## Logging

- `xLocator` and helper layers own action logging.
- Avoid ad hoc `console.log` inside page methods unless debugging a framework issue.
