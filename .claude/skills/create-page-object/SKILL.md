---
name: create-page-object
description: Scaffold a page object following the project's xPage conventions. Use when creating a new page class or adding fields/methods to an existing page.
---

## Location

Page objects live in `pages/`. One class per navigable page.

## Choose The Right Shape

Use one of these patterns:

1. **Top-level page**: extends `xPage`, owns `readonly path`, implements `isOpened()`
2. **Page with components**: an `xPage` that exposes `readonly` component fields
3. **Parameterized page helper**: a method returning `xLocator` for dynamic elements

Pages are never components and never extend `xComponent`.

## Page Template

```ts
import { expect } from '@playwright/test';
import { xPage } from '../framework/core/xPage';
import { LoginFormComponent } from '../components/LoginFormComponent';

export class LoginPage extends xPage {
  readonly path = '/login';
  readonly form = new LoginFormComponent(this.$('#login-form'));

  async isOpened(): Promise<void> {
    await expect(this.form.root).toBeVisible();
  }
}
```

## Rules

### DSL

- Use `this.$('...')` for page-owned locators.
- Keep child locators as `readonly` field initializers.
- Model parameterized locators as methods returning `xLocator`.
- Do not call `page.goto`, `page.locator`, or `page.getByRole` from tests; keep navigation and selectors inside the page.
- Do not extend `xComponent`.

### Locator Priority

1. `id`
2. `data-testid`, `name`, or stable ARIA-backed attributes
3. Stable scoped CSS selectors
4. Text-heavy or structure-heavy selectors only as a last resort

Avoid fragile positional selectors and utility-class-only selectors.

### Behavior

- Every navigable page implements `isOpened()`.
- Keep assertions out of page objects except page-readiness checks inside `isOpened()`.
- Prefer business actions over low-level mechanics.
- Navigation methods may perform actions, but the test remains responsible for constructing destination pages unless the project intentionally standardizes otherwise.

### Logging

- Let `xLocator` and helper layers own action logging.
- Do not add ad hoc console logging inside page methods unless debugging a framework issue.
