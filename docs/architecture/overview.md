# Architecture Overview

This repository implements a strict Playwright Component-DSL and keeps the authoring rules close to the code.

## Implemented layers

- `framework/config/`: typed environment parsing and Playwright config inputs
- `framework/core/`: `xLocator`, `xComponent`, `xPage`, and `xLogger`
- `framework/fixtures/`: worker-scoped fixture server and shared browser fixtures
- `framework/reporting/`: Allure attachment and locator highlighting helpers
- `assertions/`: helper assertions plus `softGroup`
- `pages/`: navigable page objects such as `LoginPage` and `DashboardPage`
- `components/`: scoped reusable components such as `LoginFormComponent` and `UsersTableComponent`
- `eslint-plugin-xframework/`: repo-local static guardrails for page, component, and test boundaries
- `tests/ui/`: DSL-first application flows
- `tests/framework/`: browser-facing framework coverage for assertions and fixtures
- `tests/unit/`: focused framework and lint rule verification

## Reference flows

- `scripts/serve-smoke-app.mjs` hosts the demo app used by the browser suites and CI.
- `pages/DashboardPage.ts`, `components/UsersTableComponent.ts`, and `tests/ui/dashboard.spec.ts` are the reference examples for nested components, parameterized locators, and assertion-helper usage.
- `docs/guides/authoring-with-the-dsl.md` and `docs/migration/*.md` explain how to apply the same patterns in new specs.
- `docs/architecture/hardening-and-readiness.md` records the repeated browser run, proxy benchmark, and deferred-item decisions.

## Locked constraints

- `xPage` and `xComponent` remain separate abstractions.
- Browser specs operate through pages and components instead of raw Playwright selectors.
- Shared framework behavior carries protecting coverage before refactors land.
- Reporting stays on Playwright HTML + Allure instead of custom reporter code.
