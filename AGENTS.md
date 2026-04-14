# AGENTS.md

Canonical, vendor-neutral contract for any coding agent working in `custom_playwright` (Claude, Codex, Gemini, others). Vendor adapters under `.claude/`, `.gemini/`, etc. are thin wrappers; this file is the source of truth.

## Project Context

- TypeScript + Playwright Component-DSL framework
- Framework core: `framework/`
- Assertion helpers: `assertions/`
- App model: `pages/`, `components/`
- Tests: `tests/ui/`, `tests/unit/`
- Lint rules: `eslint-plugin-xframework/`
- Docs: `docs/` (conventions, guides, architecture, plans, reviews, migration, cases)

## Core Rules

- Read relevant code and docs before changing behavior.
- Preserve the migration plan's locked decisions unless the task explicitly changes them.
- `xPage` and `xComponent` are separate abstractions. Pages never extend components.
- Tests do not call raw `page.goto`, `page.locator`, or `page.getByRole`; they go through pages/components.
- Prefer assertion helpers from `assertions/` over raw `expect(...)` when a helper exists.
- Use `xLogger` and helper boundaries instead of ad hoc `console.log`.
- Update docs when public usage, workflow, or extension points change.
- Keep TypeScript strict; never weaken types to push code through.
- Do not swallow exceptions silently.
- Do not mix unrelated cleanup into task work.

Detailed page/component/test conventions live in `docs/conventions/` and the relevant skills — do not restate them here.

## Task Classification

Every task maps to exactly one tier. The `manager` skill picks the tier; this table defines it.

| Tier | Criteria | Workflow |
|---|---|---|
| **T0** trivial + low risk | single file or small related set; docs/naming/formatting; narrow low-risk fix; no framework core, fixture, config, ESLint, or DSL boundary change | `.claude/workflows/trivial.md` |
| **T1** non-trivial + low/medium risk | feature or refactor in one area (pages, components, tests, or isolated helper); no framework core or shared contract change | `.claude/workflows/standard.md` |
| **T2** non-trivial + high risk | touches `framework/core/**`, `assertions/soft.ts`, fixtures, reporting, Playwright config, ESLint rules, or any shared DSL contract | `.claude/workflows/high-risk.md` |
| **T3** cross-cutting / architectural | multi-area (framework + pages/tests + docs), public-contract change, migration-level | `.claude/workflows/cross-cutting.md` |

### Risk Signals

High-risk markers (escalate at least to T2):

- Locator logging, name binding, soft assertions, retries, reporting, or Playwright execution behavior
- Public method, config key, fixture contract, or extension-point change
- New abstraction or extension point in shared code

## Orchestration Contract

- The `manager` skill decides *which* workflow runs. Workflows decide step order. Skills own procedures. Agents own role charters.
- No file restates logic owned by another layer.
- Subagents (`architect`, `code-writer`, `code-reviewer`, `writer`) are used only when the selected workflow calls for them.
- Re-review loop triggers on CRITICAL or HIGH reviewer findings. MEDIUM findings are reported, not looped.

## Skill Compliance

- If a task matches a skill description, the skill is binding procedure, not reference.
- Before substantial work, declare the skills that apply and any expected skips.
- Before declaring done, state which selected skill stages were completed, skipped, or blocked.

## Validation

- Use the `validate` skill. It owns the command matrix.
- Prefer the smallest meaningful verification first.
- If a step cannot run, say exactly what was skipped and why.

## Issue Tracking

- All issue-tracker procedure lives in the `work-with-beads` skill. Do not restate bd commands or rules elsewhere.
- Non-trivial work (T1+) is tracked in bd. T0 work is not.

## Skills Index

Scan `.claude/skills/**/SKILL.md` at session start and index the `name` + `description` frontmatter. Load a skill body only when the task matches its description.

| Skill | Description |
|---|---|
| `manager` | Classify task tier and select the workflow |
| `playwright-cli` | Automate browser interactions for discovery, DOM capture, and state management |
| `explain-code` | Explain code with diagrams and concrete flow |
| `refactor` | Rules and TDD practice for safely refactoring shared framework code |
| `review-automation-code` | Review Playwright DSL usage, page/component design, and test hygiene |
| `task-ready` | Task completion checklist |
| `validate` | Select and run the right verification steps based on what changed |
| `work-with-beads` | Project rules for tracking work in the bd issue tracker |
| `work-with-docs` | Rules for creating and maintaining docs, plans, guides, and ADRs |
| `work-with-git` | Branch strategy and git safety rules |
| `write-test` | Rules for writing and placing unit and UI tests |

## Workflows Index

The `manager` skill picks one of the four tier workflows. Tier workflows may delegate to a focused sub-workflow.

| Workflow | When |
|---|---|
| `.claude/workflows/trivial.md` | T0 |
| `.claude/workflows/standard.md` | T1 |
| `.claude/workflows/high-risk.md` | T2 |
| `.claude/workflows/cross-cutting.md` | T3 |
| `.claude/workflows/author-test.md` | New spec from a case (called from T1) |
| `.claude/workflows/repair-test.md` | Failing or flaky spec (called from T1) |

## Subagents Index

Use only when the selected workflow calls for them.

| Agent | Role |
|---|---|
| `architect` | Produces an implementation plan file. Required for T2 and T3. |
| `code-writer` | Implements a plan step by step and owns validation. |
| `code-reviewer` | Reviews the real diff and reports severity-grouped findings. |
| `writer` | Updates `docs/` when public usage, workflow, or architecture changed. |

## Convention References

Load only when the task touches the matching area.

| Reference | Used by |
|---|---|
| `docs/conventions/page-objects.md` | anyone creating or editing `pages/**` |
| `docs/conventions/components.md` | anyone creating or editing `components/**` |
