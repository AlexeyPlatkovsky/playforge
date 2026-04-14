# Component Conventions

Reference for any code that creates or edits `xComponent` subclasses.

## Location

Reusable components live in `pages/components/`.

## Template

```ts
import { xComponent } from '../../framework/core/xComponent';

export class SubscriptionFooterComponent extends xComponent {
  readonly email = this.root.getByPlaceholder('Your email address');
  readonly submit = this.$('#subscribe');

  async subscribeAs(address: string): Promise<void> {
    await this.email.fill(address);
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
- Use CSS selectors that can chain reliably under `this.root`.
