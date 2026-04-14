# AGENTS.md

## Purpose

Project-specific baseline for coding agents working in `custom_playwright`.

## Project Context

- TypeScript + Playwright Component-DSL framework
- Core framework code: `framework/`
- Assertion helpers: `assertions/`
- App model: `pages/`, `components/`
- Test code: `tests/ui/`, `tests/unit/`
- Lint rules: `eslint-plugin-xframework/`
- Docs and workflow material: `docs/`

## Core Rules

- Read the relevant code and docs before changing behavior.
- Preserve the migration plan's locked decisions unless the task explicitly changes them.
- `xPage` and `xComponent` are separate abstractions. Pages never extend components.
- Child locators in pages/components are `readonly` field initializers via `this.$('...')`.
- Parameterized locators are methods returning `xLocator`; never store them as fields.
- Tests do not call raw `page.goto`, `page.locator`, or `page.getByRole`; they go through pages/components.
- Prefer assertion helpers from `assertions/` over raw `expect(...)` in tests.
- Keep logs and steps meaningful; use `xLogger` and Allure-friendly helper boundaries rather than ad hoc `console.log`.
- Update docs when public usage, workflow expectations, or extension points change.
- For framework refactoring, use TDD: add or adjust the protecting unit test first, confirm the expected failure or preserved behavior, then change production code.
- For material UI automation changes under `pages/`, `components/`, or `tests/ui/`, run the `review-automation-code` skill before handoff.

## Trivial Vs Non-Trivial Tasks

### Trivial

Usually trivial if most are true:

- One file or a very small related set
- Docs/comments/naming/formatting only
- Narrow low-risk bug fix
- No framework core, assertion helper, fixture, config, ESLint rule, or page/component boundary change
- No migration guidance or cross-folder coordination needed

### Non-Trivial

Treat as non-trivial if any are true:

- Adds a feature, abstraction, or extension point
- Changes shared DSL behavior or default conventions
- Changes public methods, config keys, fixture contracts, or reporting behavior
- Touches multiple areas such as framework + pages/tests + docs
- Needs new tests, design tradeoffs, or migration guidance
- May affect locator logging, name binding, soft assertions, retries, or Playwright execution behavior

Use `ORCHESTRATION.md` for delegation rules on non-trivial tasks.

## Coding Guidelines

- Keep TypeScript strict; do not weaken types to push code through.
- Prefer explicit exports and small modules over broad index indirection unless the repo already uses it.
- Favor readable, testable code over clever abstractions.
- Use ASCII unless a file already requires Unicode.
- Keep comments rare and high-signal.
- Do not swallow exceptions silently.
- Do not introduce raw locator usage in tests to save time.
- In components, do not call `page.locator`; use `this.$(...)` or chained `this.root.locator(...)` and keep fields as initializers so name binding can work.
- In pages, implement `isOpened()` on every navigable `xPage` subclass.
- Keep line length reasonable; target the project's existing style where one exists.

## Validation

- Run the smallest meaningful verification first.
- For non-trivial work, run the relevant typecheck, lint, and Playwright coverage before claiming completion.
- If you cannot run full validation, say what was skipped.
- For framework refactoring, the protecting unit test is part of the completion criteria.
- Prefer targeted Playwright specs over broad suite runs.
- Use the `validate` skill for the command matrix.

## Scope And Communication

- Do not mix unrelated cleanup into task work unless asked.
- If you find a broader issue, note it separately instead of silently expanding scope.
- For non-trivial work, summarize the plan before broad edits.
- State assumptions, risks, and unverified areas plainly.

## Skill Compliance

- If a task matches a local skill, use that skill and follow its workflow.
- Treat matched skills as binding procedure, not optional reference material.
- If you must deviate from a matched skill, state the blocker before proceeding.
- Before substantial work, declare the triggered skills, why they apply, and any expected skips.
- Before considering the task complete, state which selected skill stages were completed, skipped, or blocked.

## Skills

At session start, scan all `.claude/skills/**/SKILL.md` files and index their `name` and `description` frontmatter fields. Load the full body of a skill only when a task matches its description.

| Skill | Description |
|---|---|
| `ai-write-test` | Author, edit, or fix Playwright tests and the page/component code they require |
| `playwright-cli` | Automate browser interactions for discovery, DOM capture, and state management |
| `create-page-object` | Scaffold a page object following the project's `xPage` conventions |
| `create-component` | Scaffold a reusable `xComponent` with field-initialized child locators |
| `explain-code` | Explain code with diagrams and concrete flow |
| `refactor` | Rules and practices for safely refactoring shared framework code |
| `review-automation-code` | Review Playwright DSL usage, page/component design, and test hygiene |
| `task-ready` | Task completion checklist |
| `validate` | Select and run the right verification steps based on what changed |
| `work-with-docs` | Rules for creating and maintaining docs, plans, guides, and ADRs |
| `work-with-git` | Branch strategy and git safety rules |
| `write-test` | Rules for writing and placing unit and UI tests |
