# Architecture Overview

This repository implements a strict Playwright Component-DSL and keeps the authoring rules close to the code.

## Implemented layers

- `framework/config/`: typed environment parsing and Playwright config inputs
- `framework/core/`: `xLocator`, `xComponent`, `xPage`, and `xLogger`
- `framework/fixtures/`: worker-scoped fixture server and shared browser fixtures
- `framework/reporting/`: Allure attachment and locator highlighting helpers
- `assertions/`: helper assertions plus `softGroup`
- `pages/`: navigable page objects such as `HomePage`, `ProductsPage`, and `ProductDetailsPage`
- `pages/components/`: scoped reusable components such as `SiteHeaderComponent`, `ProductsCatalogComponent`, and `SubscriptionFooterComponent`
- `eslint-plugin-xframework/`: repo-local static guardrails for page, component, and test boundaries
- `tests/ui/`: DSL-first application flows
- `tests/framework/`: browser-facing framework coverage for assertions and fixtures
- `tests/unit/`: focused framework and lint rule verification

## Reference flows

- `https://automationexercise.com/` is the live target used by the browser suites.
- `xPage.open()` installs a one-time handler for the live target's consent dialog so page readiness checks and DSL interactions are not blocked by the overlay.
- `pages/HomePage.ts`, `pages/ProductsPage.ts`, `pages/ProductDetailsPage.ts`, and `tests/ui/products.spec.ts` are the reference examples for nested components, parameterized locators, and assertion-helper usage.
- `docs/guides/authoring-with-the-dsl.md` and `docs/migration/*.md` explain how to apply the same patterns in new specs.
- `docs/architecture/hardening-and-readiness.md` records the repeated browser run, proxy benchmark, and deferred-item decisions.

## AI Instruction System

The `.ai/` directory holds the AI operational layer. Key components:

- `manager` skill — classifies and routes tasks; selects a pipeline; appends `documentation-maintenance` then `task-complete` on non-trivial work
- `create-test-from-spec` pipeline — staged workflow for test generation: explorer → developer → reviewer → task-complete
- `explorer` agent — read-only; inspects pages, components, fixtures, and patterns before implementation; produces a compact `EXPLORER OUTPUT` handoff
- `developer` agent — implements a test from spec using the explorer output as mandatory context; scoped to `create-test-from-spec`
- `test-reviewer` agent — read-only; validates generated tests for DSL compliance, selector quality, and maintainability; produces a `Verdict + Findings` handoff
- `documentation-maintenance` skill — updates docs after changes that affect behavior, interfaces, commands, architecture, or domain facts; runs before `task-complete`
- `task-complete` skill — closure record for every non-trivial routed task
- `instruction-evaluator` agent — read-only; evaluates instruction artifacts (skills, pipelines, agents, conventions)
- `sync-manifesto` skill — ensures `.manifesto/` exists and matches the latest agent-manifesto release

Each stage in `create-test-from-spec` passes an explicit handoff block (`EXPLORER OUTPUT`, `DEVELOPER OUTPUT`, `Verdict + Findings`) — no implicit context passing between stages.

## Locked constraints

- `xPage` and `xComponent` remain separate abstractions.
- Browser specs operate through pages and components instead of raw Playwright selectors.
- Shared framework behavior carries protecting coverage before refactors land.
- Reporting stays on Playwright HTML + Allure instead of custom reporter code.
