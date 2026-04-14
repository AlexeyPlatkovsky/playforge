---
name: validate
description: Select and run the right verification steps based on what changed. Use after editing code, docs, config, or skills.
---

Inspect what changed first, then run the smallest meaningful verification and broaden only when the change surface requires it.

## Decision Table

| What changed | Commands to run |
|---|---|
| `framework/**` or `assertions/**` only | `npx tsc --noEmit`, `npx playwright test tests/unit`, `npx eslint .` |
| `pages/**` or `components/**` only | `npx tsc --noEmit`, targeted `npx playwright test <relevant-ui-spec>`, `npx eslint .` |
| `tests/framework/**` only | `npx tsc --noEmit`, targeted `npx playwright test <relevant-framework-spec>` |
| `tests/unit/**` only | `npx tsc --noEmit`, targeted `npx playwright test tests/unit` |
| `tests/ui/**` only | `npx tsc --noEmit`, targeted `npx playwright test <relevant-ui-spec>` |
| `eslint-plugin-xframework/**` only | `npx tsc --noEmit`, rule tests if present, `npx eslint .` |
| Build/config files | `npx tsc --noEmit`, `npx playwright test tests/unit`, `npx eslint .` |
| `.claude/skills/**` only | No toolchain run required; verify referenced paths, commands, and repo conventions |
| Docs only | Review for accuracy and consistency with current repo structure |
| Mixed framework + tests/pages/components | `npx tsc --noEmit`, `npx playwright test tests/unit`, the narrowest relevant UI spec, `npx eslint .` |

## Rules

- Typecheck before Playwright when practical.
- Prefer targeted specs over broad suite runs.
- Shared DSL changes are non-trivial by default.
- If package scripts exist and are the repo norm, you may use them instead of equivalent `npx` commands.
- If validation cannot run because dependencies are not installed yet, say exactly what was skipped.
