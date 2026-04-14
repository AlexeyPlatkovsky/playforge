---
name: create-component
description: Scaffold a reusable xComponent with a stable root and field-initialized child locators. Use for nested sections, widgets, forms, and reusable page fragments.
---

## Location

Reusable components live in `components/`.

## Component Template

```ts
import { xComponent } from '../framework/core/xComponent';

export class LoginFormComponent extends xComponent {
  readonly username = this.$('input[name="username"]');
  readonly password = this.$('input[name="password"]');
  readonly submit = this.$('button[type="submit"]');

  async loginAs(user: string, pass: string): Promise<void> {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.submit.click();
  }
}
```

## Rules

- Extend `xComponent` only.
- The constructor input is the scoped `root` locator; do not store raw `Page`.
- Child locators are `readonly` field initializers via `this.$('...')`.
- Parameterized locators are methods returning `xLocator`.
- Nested components are `readonly` fields constructed from scoped roots.
- Do not lazily assign child locators in methods; name binding depends on field initialization.
- Do not call `page.locator` from components.
- Keep component APIs at the level of user intent, not raw click/fill sequences unless the action is genuinely atomic.

## Locator Guidance

- Scope selectors through the component root.
- Prefer selectors that survive copy and layout changes.
- Use CSS selectors that can be chained reliably under `this.root`.
