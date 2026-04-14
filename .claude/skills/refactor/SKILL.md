---
name: refactor
description: TDD-first rules for safely refactoring shared framework code. Use when restructuring xLocator, xComponent, xPage, xLogger, fixtures, assertions, or ESLint enforcement.
---

## When To Use

Any change that:

- Restructures shared framework code under `framework/`
- Changes public methods, fixture contracts, helper signatures, or config defaults
- Changes locator logging, name binding, soft assertion behavior, reporting, or retries
- Moves or renames classes used across multiple areas

Do not use this skill for isolated page/component tweaks or doc-only changes.

## TDD Rule

Before changing production code:

1. Write or update a unit test that describes the behavior being preserved or fixed.
2. Run it and confirm the expected pass/fail state.
3. Change production code.
4. Rerun the protecting test before broadening validation.

Protecting tests live in `tests/unit/`.

## High-Risk Areas

| Area | Risk |
|---|---|
| `framework/core/xLocator.ts` | Logging, proxy behavior, type fidelity, chained wrapping |
| `framework/core/xComponent.ts` | Name-binding timing and nested component initialization |
| `framework/core/xPage.ts` | Navigation contract and page readiness |
| `assertions/soft.ts` | Soft/hard mode state leaks across async flows |
| `framework/fixtures/` | Worker lifecycle, shared state, server startup |
| `eslint-plugin-xframework/` | Build-time enforcement across the whole repo |

## Validation

Use the `validate` skill for the command matrix. After the protecting test passes, broaden only as the change surface requires.
