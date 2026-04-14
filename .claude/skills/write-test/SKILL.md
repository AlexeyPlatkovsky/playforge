---
name: write-test
description: Rules for writing and placing Playwright tests in this project. Use when creating unit tests, UI tests, or reviewing generated specs.
---

## Test Locations

| Type | Location |
|---|---|
| Framework unit tests | `tests/unit/` |
| UI specs | `tests/ui/` |
| Page objects | `pages/` |
| Components | `components/` |

## Tagging

- UI specs should carry `@ui` in the test title or describe block.
- Unit/framework specs should carry `@unit`.
- Use `--grep` against those tags when running focused suites.

## Rules

- Prefer the project fixture and assertion helpers over direct `@playwright/test` imports.
- Do not use raw `page.goto`, `page.locator`, or `page.getByRole` in test files.
- Do not use raw `expect(...)` in tests when a helper already covers the assertion.
- Never hardcode credentials or secrets; read them from environment variables and fail fast if missing.
- Construct page objects near the top of the test unless navigation order makes that impossible.
- Keep locators in pages/components, not specs.

## Related References

- Page / component conventions: `docs/conventions/page-objects.md`, `docs/conventions/components.md`
- Framework refactors: `refactor`
- Review after multi-file UI changes: `review-automation-code`
- Validation: `validate`

## Review Checklist For Generated Specs

- The spec reads in terms of business actions, not selector mechanics.
- Page ownership is clear: URLs and page-specific constants belong to the owning page.
- Components own reusable page fragments.
- Assertions match the scenario contract precisely.
