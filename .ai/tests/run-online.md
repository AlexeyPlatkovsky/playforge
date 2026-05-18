# Online Runner

Runs pipeline scenarios with real AI agents and a live browser. `npm run test:ui` executes in Stage 2 - the generated test must pass against the live automationexercise.com site.

This runner is a pipeline drift check. Generated files are disposable scenario artifacts and must be cleaned after each scenario.

## Prerequisites

- Playwright browser binaries installed (`npx playwright install`)
- Live site reachable (automationexercise.com)
- `npm run test:ui` passes locally before running scenarios

## How to Signal Online Mode

When invoking Stage 2 (developer), append this instruction to the prompt:

> **Mode: online.** Run `npm run typecheck`, `npm run lint`, and `npm run test:ui`. Record all results in the DEVELOPER OUTPUT block.

The DEVELOPER OUTPUT block must include:

```text
Browser verification - passed
```

or `failed` with the test output if the suite does not pass.

## Stage Invocation Templates

Use the shared templates in `.ai/docs/templates/pipeline-stage-prompts/` for every stage invocation:

- Stage 1: `.ai/docs/templates/pipeline-stage-prompts/explorer.md`
- Stage 2: `.ai/docs/templates/pipeline-stage-prompts/developer.md`
- Stage 3: `.ai/docs/templates/pipeline-stage-prompts/test-reviewer.md`

Before starting a stage, run the preflight in `.ai/docs/templates/pipeline-stage-prompts/README.md`.
Fill every template field explicitly; do not rely on an agent to infer the spec, handoff blocks, or mode from surrounding conversation.

## Common Scenario Harness

For every scenario:

1. Record baseline `git status --short`.
2. Follow the scenario card and runner steps.
3. Apply the scenario card's cleanup requirement.
4. Compare final `git status --short` with the baseline.
5. Record `FAIL` if any scenario-created or scenario-modified file remains.

Do not clean unrelated pre-existing worktree changes.

## Scenarios Suited for Online Mode

Scenarios 01 and 05 are the primary online targets - they require a full browser run to confirm the generated test is functionally correct. Behavioral scenarios (02-04, 07-09) do not benefit from a browser run because they test pipeline behavior, not test correctness.

| Scenario | Online value |
|---|---|
| 01 - Happy path | High - confirms generated test is green |
| 05 - No existing context | High - confirms new page object and spec are functional |
| 06 - Raw locator violation | Low - ESLint fires before browser; result is the same as offline |
| 07 - Needs revision loop | Low - behavioral, not test correctness |
| 08 - Max revision cycles | Low - behavioral |
| 02, 03, 04, 09 | None - blocking behavior does not depend on browser |

## Scenario Execution

### 01 - Happy Path (Online)

1. Load scenario: `.ai/tests/scenarios/01-happy-path.md`
2. Invoke Stage 1 (explorer) with the explorer template, the scenario path, the spec from the scenario card, target `Products page search flow`, mode `online`, and injected fixtures `none`.
3. Invoke Stage 2 (developer) with the developer template, the scenario path, the spec, the complete EXPLORER OUTPUT, reviewer findings `none`, and the online mode instruction above.
4. Invoke Stage 3 (reviewer) with the reviewer template, the scenario path, the spec, the complete EXPLORER OUTPUT, the complete DEVELOPER OUTPUT, revision cycle `none`, and injected fixtures `none`.
5. Check: `npm run test:ui - passed` appears in DEVELOPER OUTPUT. Reviewer verdict is `Approve` or `Approve with minor fixes`.
6. Clean scenario changes listed in the scenario card.

---

### 05 - No Existing Context (Online)

1. If `pages/ContactUsPage.ts` or `tests/ui/contact.spec.ts` already exists and was not created by this scenario, mark `SKIP` with reason `dirty scenario target`.
2. Load scenario: `.ai/tests/scenarios/05-no-existing-context.md`
3. Invoke Stage 1 (explorer) with the explorer template, the scenario path, the Contact Us spec, target `Contact Us form submission flow`, mode `online`, and injected fixtures `none`.
4. Invoke Stage 2 (developer) with the developer template, the scenario path, the spec, the complete EXPLORER OUTPUT, reviewer findings `none`, and the online mode instruction above.
5. Invoke Stage 3 (reviewer) with the reviewer template, the scenario path, the spec, the complete EXPLORER OUTPUT, the complete DEVELOPER OUTPUT, revision cycle `none`, and injected fixtures `none`.
6. Check: `npm run test:ui - passed` appears in DEVELOPER OUTPUT. New files listed. Reviewer produces a verdict.
7. Delete `pages/ContactUsPage.ts` and `tests/ui/contact.spec.ts` if the scenario created them.

---

## Recording Results

| Scenario | Result | Browser result | Notes |
|---|---|---|---|
| 01 | | | |
| 05 | | | |

Results: `PASS`, `FAIL`, or `SKIP` (with reason). Browser result: `passed`, `failed`, or `skipped`.

Record cleanup status in `Notes`. Use `FAIL` if cleanup cannot restore the pre-scenario status without touching unrelated work.
