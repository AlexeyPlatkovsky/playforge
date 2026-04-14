# Selenium Author Checklist

Use this checklist when moving a Selenium or PageFactory flow into this repository's TypeScript DSL.

## Mental-model swaps

- `@FindBy` fields become `readonly` locators created with `this.$(...)`.
- Template or formatted locators become methods such as `rowByName(name)`, not mutable fields.
- PageFactory pages map to `xPage`; reusable regions map to `xComponent`.
- `driver.get(...)` or `page.goto(...)` in specs becomes `await new SomePage(page).open()`.
- `assertAll` style batches become `await softGroup("title", async () => { ... })`.
- Raw `expect(locator)` in specs becomes the matching helper from `assertions/` when one exists.
- Shared browser setup should come from `framework/fixtures/app.fixture`, not ad hoc globals in each spec.

## What Not To Port Mechanically

- Do not carry raw selectors into specs.
- Do not recreate Java inheritance chains by making pages extend components.
- Do not store parameterized locators in fields that depend on runtime values.
- Do not preserve every low-level click/fill step when the page or component can expose a business action instead.

## Repo References

- Page patterns: `docs/conventions/page-objects.md`
- Component patterns: `docs/conventions/components.md`
- End-to-end authoring guide: `docs/guides/authoring-with-the-dsl.md`
- Side-by-side examples: `docs/migration/custom-webelement-side-by-side.md`
- Concrete TypeScript reference flow: `tests/ui/dashboard.spec.ts`

## Recommended Port Order

1. Model the page and component boundaries first.
2. Move stable locators into `readonly` fields and dynamic locators into methods.
3. Add business actions on pages or components.
4. Rewrite the spec in terms of those actions.
5. Replace raw assertions with helpers.
6. Run `npx eslint .`, then the narrowest relevant Playwright spec.
