# Architecture Overview

This repository is being built in phases around a strict Playwright Component-DSL.

## Current baseline

- `framework/config/`: typed environment schema and runtime config loader
- `tests/unit/`: framework-facing verification that does not require DSL classes yet
- `tests/ui/`: runner smoke coverage proving browser entry, reporters, and web server wiring
- `scripts/serve-smoke-app.mjs`: local HTML target used by smoke coverage and CI

## Planned layers

- `framework/core/`: `xLocator`, `xComponent`, `xPage`, `xLogger`
- `assertions/`: helper assertions and `softGroup`
- `pages/`: app-specific page objects
- `components/`: reusable scoped components
- `tests/ui/`: DSL-first specs that operate through pages and components

## Locked constraints

- `xPage` and `xComponent` remain separate abstractions.
- Tests should move through pages and components instead of raw Playwright selectors.
- Shared framework behavior must be protected by unit coverage before refactors land.
- Reporting stays on Playwright HTML + Allure instead of custom reporter code.
