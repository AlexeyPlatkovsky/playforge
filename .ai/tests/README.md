# Pipeline Test System

Verification suite for the `create-test-from-spec` pipeline. These scenarios are drift checks for the pipeline contract, not product work. All scenarios run with real AI agents. The only difference between modes is whether `npm run test:ui` executes in Stage 2.

## Drift Check Contract

The suite validates whether the pipeline still follows its stage contracts:

- Stage agents are invoked with the shared templates in `.ai/docs/templates/pipeline-stage-prompts/`, with every required input field filled explicitly.
- Explorer produces an explicit `EXPLORER OUTPUT` block before Developer starts.
- Developer refuses missing or incomplete Explorer input.
- Developer records required verification in a `DEVELOPER OUTPUT` block and never hands off failing non-skipped checks.
- Reviewer refuses missing handoff blocks, uses Explorer context, and returns the expected verdict.
- Revision loops stop at the configured limit.
- Generated files are disposable scenario artifacts and are cleaned after the scenario.

Passing a scenario must not silently adopt generated product files into the repository. If a scenario reveals useful product work, report it separately and keep the drift-check result focused on pipeline behavior.

## Modes

| Mode | AI agents | typecheck + lint | npm run test:ui |
|---|---|---|---|
| **Offline** | yes | yes | no |
| **Online** | yes | yes | yes |

See `run-offline.md` and `run-online.md` for invocation instructions.

## Workspace Rules

Before each scenario:

1. Record the current worktree state with `git status --short`.
2. Confirm the scenario's expected disposable files do not already exist unless the scenario explicitly says it mutates an existing file.
3. If a scenario mutates an existing file, confirm that file has no pre-existing uncommitted changes.
4. If an expected disposable file already exists from unrelated work, or an existing-file mutation target is already dirty, mark the scenario `SKIP` with the reason `dirty scenario target`.

After each scenario:

1. Remove only files created by the scenario.
2. Restore only files modified by the scenario.
3. Run `git status --short`.
4. Compare with the pre-scenario status. The scenario fails if it leaves new or modified files not present before the scenario.

Never clean unrelated pre-existing worktree changes.

## Coverage

| # | Scenario | Category | Offline | Online |
|---|---|---|---|---|
| 01 | Happy path - full pipeline, reviewer approves | Happy path | yes | yes |
| 02 | Developer blocks on missing EXPLORER OUTPUT | Negative | yes | no |
| 03 | Reviewer blocks on missing DEVELOPER OUTPUT | Negative | yes | no |
| 04 | Reviewer blocks on missing EXPLORER OUTPUT | Negative | yes | no |
| 05 | Explorer finds no existing context | Edge case | yes | yes |
| 06 | Raw locator violation caught by ESLint | Edge case | yes | no |
| 07 | Reviewer returns Needs revision, developer fixes | Edge case | yes | no |
| 08 | Two failed revision cycles - pipeline escalates | Edge case | yes | no |
| 09 | Reviewer rejects - back to Stage 1 | Negative | yes | no |
| 10 | Search result opens product details | Online complexity | no | yes |
| 11 | Brand filter opens product details | Online complexity | no | yes |
| 12 | Product details subscription | Online complexity | no | yes |

## Fixtures

Pre-baked input blocks for behavioral scenarios (02-04, 06-09). Inject these instead of running the upstream stage.

| File | Contents |
|---|---|
| `fixtures/explorer-output-valid.md` | Well-formed EXPLORER OUTPUT for a products search spec |
| `fixtures/explorer-output-no-context.md` | EXPLORER OUTPUT with no relevant files found |
| `fixtures/developer-output-valid.md` | Well-formed DEVELOPER OUTPUT, all checks passed |
| `fixtures/developer-output-lint-fail.md` | DEVELOPER OUTPUT with lint: failed |

## Pass / Fail

A scenario passes when the **Pass criterion** in the scenario card is met. A scenario fails when the agent produces output that contradicts the expected outcome.

Generated code that passes lint and tests is still disposable unless the user explicitly asks to keep it.

Record results as: `PASS`, `FAIL`, or `SKIP` (with reason). For scenarios that write files, record cleanup status in `Notes`. Use `FAIL` if cleanup cannot restore the pre-scenario status without touching unrelated work.
