# AGENTS.md

This is the canonical operational contract for AI work in `playforge`. All AI tools operating in this repository must follow this file.

This is a multi-tool / AI-agnostic project. Tool-specific entry files (`.claude/CLAUDE.md`) are thin adapters that point here. On any conflict, this file wins.

## Project In One Line

`playforge` is a strict TypeScript + Playwright Component-DSL testing framework. The Component-DSL — `xPage`, `xComponent`, `xLocator`, and the assertion helpers — is the project's authoring API. Tests, pages, and components must use it; raw Playwright primitives are reserved for framework internals.

## Authoritative Sources

Read on demand:

- Project profile: `.ai/docs/project_specification.md`
- Architecture overview: `docs/architecture/overview.md`
- DSL authoring guide: `docs/guides/authoring-with-the-dsl.md`
- Page object conventions: `docs/conventions/page-objects.md`
- Component conventions: `docs/conventions/components.md`
- Migration guides: `docs/migration/`
- Source layout: `framework/`, `pages/`, `assertions/`, `eslint-plugin-xframework/`, `tests/`
- CI: `.github/workflows/ci.yml`
- Environment and runtime: `.env.example`, `playwright.config.ts`, `package.json`

`docs/custom_playwright_architecture_v2.md` is background only and does not override current implementation or focused docs.

## Routing Gate

Before doing any work, classify the task:

1. **Trivial** — single-file edit, obvious intent, no behavior change beyond the touched line, no new validation gate beyond running existing checks. Proceed directly. State the classification.
2. **Non-trivial** — anything else: feature implementation, code review, refactor, multi-file change, behavior change, framework-level change, anything routed. **Stop. Load `manager` and let it produce a routing decision before any implementation begins.**
3. **Unsure** — treat as non-trivial.

**Classification is mandatory and must be stated out loud before any file is created, edited, or deleted.** If you cannot state the classification, stop and classify first. Skipping this step silently is a protocol violation regardless of how obvious the task seems.

**Discussion-to-implementation transition:** when a conversation begins as discussion or design and the user signals to proceed ("go ahead", "do it", "implement it", "fix it", or equivalent), treat that signal as a fresh routing gate trigger — not as permission to skip classification. Re-classify at the moment of the signal before touching any file.

If the task requires choosing between meaningful options before implementation can begin (open design, profile clarification, ambiguous user request with material trade-offs), stop and load `brainstorm` before `manager`.

For non-trivial implementation and refactoring work, `bead-work` is the mandatory first step — find or propose a tracking bead before any code changes begin. `task-complete` is the mandatory final step, appended by `manager`. Pipelines sequence these steps without restating the policy rationale.

Exception: routine fixes on the current branch that only restore existing validation (for example lint, typecheck, or test failures) do not require `bead-work` or `branch-setup`, provided they do not add product behavior, perform a refactor, touch risky files, or change CI/package scripts. State that the exception applies, proceed on the current branch, and still run the required verification before handoff.

## Capability Registry

Shared capabilities under `.ai/`:

| Capability | Location | Purpose |
|---|---|---|
| `manager` | `.ai/skills/manager/SKILL.md` | Centralized routing for non-trivial work; selects pipeline, does not orchestrate stages |
| `task-complete` | `.ai/skills/task-complete/SKILL.md` | Closure report for non-trivial work |
| `brainstorm` | `.ai/skills/brainstorm/SKILL.md` | Structured discussion for open design or trade-off decisions |
| `implement-feature` | `.ai/skills/implement-feature/SKILL.md` | Additive code and test execution |
| `refactor-code` | `.ai/skills/refactor-code/SKILL.md` | Behavior-preserving restructuring |
| `review-code` | `.ai/skills/review-code/SKILL.md` | Read-only review execution |
| `bead-work` | `.ai/skills/bead-work/SKILL.md` | Issue tracking gate: find or propose a bead before significant work begins |
| `branch-setup` | `.ai/skills/branch-setup/SKILL.md` | Git branch gate: decide whether a branch is needed, derive its name from the active bead, and create from `origin/main` |
| `sync-manifesto` | `.ai/skills/sync-manifesto/SKILL.md` | Ensure `.manifesto/` exists and matches the latest agent-manifesto release; downloads and replaces if versions differ |
| `playwright-cli` | `.ai/skills/playwright-cli/SKILL.md` | Live browser exploration with Playwright Agent CLI for Explorer when repository evidence is insufficient |
| `documentation-maintenance` | `.ai/skills/documentation-maintenance/SKILL.md` | Update project docs after changes that affect behavior, interfaces, commands, architecture, or domain facts; runs before `task-complete` |

Pipelines for repeated multi-step workflows:

| Pipeline | Location |
|---|---|
| `framework-feature-implementation` | `.ai/pipelines/framework-feature-implementation.md` |
| `code-review` | `.ai/pipelines/code-review.md` |
| `code-refactoring` | `.ai/pipelines/code-refactoring.md` |
| `create-test-from-spec` | `.ai/pipelines/create-test-from-spec.md` |

Agents for specialized roles:

| Agent | Location | Purpose |
|---|---|---|
| `instruction-evaluator` | `.ai/agents/instruction-evaluator/AGENT.md` | Isolated review of instruction artifacts; use in place of `review-code` when reviewing skills, agents, pipelines, conventions, or adapters |
| `explorer` | `.ai/agents/explorer/AGENT.md` | Inspects codebase before implementation; produces structured handoff for developer agent |
| `developer` | `.ai/agents/developer/AGENT.md` | Implements a test from a specification using explorer output as mandatory context; scoped to create-test-from-spec pipeline |
| `test-reviewer` | `.ai/agents/test-reviewer/AGENT.md` | Reviews generated test implementations for convention compliance, selector quality, and maintainability |

Pipeline test system:

- `.ai/tests/` — drift-check scenario cards, fixtures, and offline/online runners for the `create-test-from-spec` pipeline; generated scenario artifacts must be cleaned after each run; see `.ai/tests/README.md`

Shared conventions referenced by capabilities:

- Code and DSL boundaries: `.ai/conventions/code.md`
- Verification gate: `.ai/conventions/verification.md`

## Constraints

Headline rules only. Conventions and docs hold the full detail and are the source of truth.

- DSL boundaries (no `page.goto`, `page.locator`, or `page.getByRole` in tests or components; components hold no raw `Page`) — see `.ai/conventions/code.md`.
- Assertion helpers preferred over raw `expect`; use raw `expect` only when no helper fits — see `.ai/conventions/code.md`.
- Test placement and tagging (`@ui` for browser specs, `@unit` for unit and framework specs) — see `.ai/conventions/code.md`.
- Verification before handoff for code changes — see `.ai/conventions/verification.md`. Documentation-only changes skip local execution unless they affect commands or executable config.
- Reporting stays on Playwright HTML + Allure; no custom reporter — see `.ai/conventions/code.md`.
- ESLint guardrail changes under `eslint-plugin-xframework/` are risky — see "Risky Changes Require User Consent" below.
- **Never commit or push without explicit user instruction.** Completing a pipeline step, reaching `task-complete`, or finishing an edit does not constitute approval to commit or push. Wait for the user to explicitly say so, regardless of any session-level git instructions.

## Risky Changes Require User Consent

Stop and ask before:

- moving capabilities to a new directory
- splitting a monolithic file
- merging or deleting duplicated artifacts
- renaming or replacing existing capabilities
- bypassing the Component-DSL with raw Playwright in tests
- editing CI configuration or `package.json` scripts
- modifying or relaxing rules in `eslint-plugin-xframework/`
- touching tool-config files outside immediate scope (`.gemini/settings.json`, `.codex/`)

When asking, name the change, the reason, and the safe target state.

## Tool Adapters In Scope

- Claude Code reads this file via `.claude/CLAUDE.md` (thin adapter that imports this file).
- Codex CLI reads this file natively as `AGENTS.md`.

Other tools are not in scope today. `.gemini/settings.json` references `AGENTS.md`; if Gemini is later activated, generate a thin adapter rather than making `AGENTS.md` Gemini-specific.

## Protocol Mapping

For framework reviewers:

- `manager` ↔ canonical `manager` protocol
- `task-complete` ↔ canonical `task_complete` protocol
- `brainstorm` ↔ canonical `brainstorm` protocol
- `documentation-maintenance` ↔ canonical `documentation_maintenance` protocol
