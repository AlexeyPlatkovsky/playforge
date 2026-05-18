# Offline Runner

Runs all pipeline scenarios with real AI agents. `npm run test:ui` is skipped - the developer agent stops after typecheck and lint.

This runner is a pipeline drift check. It must not leave generated scenario artifacts in the repository.

## How to Signal Offline Mode

When invoking Stage 2 (developer), append this instruction to the prompt:

> **Mode: offline.** Run `npm run typecheck` and `npm run lint` but do not run `npm run test:ui`. Record `Browser verification - skipped (offline mode)` in the DEVELOPER OUTPUT block and pass it to Stage 3.

## Stage Invocation Templates

Use the shared templates in `.ai/docs/templates/pipeline-stage-prompts/` for every stage invocation:

- Stage 1: `.ai/docs/templates/pipeline-stage-prompts/explorer.md`
- Stage 2: `.ai/docs/templates/pipeline-stage-prompts/developer.md`
- Stage 3: `.ai/docs/templates/pipeline-stage-prompts/test-reviewer.md`

Before starting a stage, run the preflight in `.ai/docs/templates/pipeline-stage-prompts/README.md`.
For negative scenarios, fill the omitted block field as `omitted for this negative scenario` instead of leaving the prompt ambiguous.

## Common Scenario Harness

For every scenario:

1. Record baseline `git status --short`.
2. Follow the scenario card and runner steps.
3. Apply the scenario card's cleanup requirement.
4. Compare final `git status --short` with the baseline.
5. Record `FAIL` if any scenario-created or scenario-modified file remains.

Do not clean unrelated pre-existing worktree changes.

## Scenario Execution

### 01 - Happy Path

1. Load scenario: `.ai/tests/scenarios/01-happy-path.md`
2. Invoke Stage 1 (explorer) with the explorer template, the scenario path, the spec from the scenario card, target `Products page search flow`, mode `offline`, and injected fixtures `none`.
3. Invoke Stage 2 (developer) with the developer template, the scenario path, the spec, the complete EXPLORER OUTPUT, reviewer findings `none`, and the offline mode instruction above.
4. Invoke Stage 3 (reviewer) with the reviewer template, the scenario path, the spec, the complete EXPLORER OUTPUT, the complete DEVELOPER OUTPUT, revision cycle `none`, and injected fixtures `none`.
5. Check: reviewer verdict is `Approve` or `Approve with minor fixes`.
6. Clean scenario changes listed in the scenario card.

---

### 02 - Developer Blocks on Missing EXPLORER OUTPUT

1. Load scenario: `.ai/tests/scenarios/02-dev-blocks-missing-explorer.md`
2. Invoke Stage 2 (developer) with the developer template, the scenario path, the spec, Explorer handoff `omitted for this negative scenario`, reviewer findings `none`, and the offline mode instruction above.
3. Check: developer produces no DEVELOPER OUTPUT block; response contains a stop-and-request for EXPLORER OUTPUT.

---

### 03 - Reviewer Blocks on Missing DEVELOPER OUTPUT

1. Load scenario: `.ai/tests/scenarios/03-reviewer-blocks-missing-developer.md`
2. Inject fixture: `fixtures/explorer-output-valid.md`
3. Invoke Stage 3 (reviewer) with the reviewer template, the scenario path, the spec, the complete EXPLORER OUTPUT fixture, Developer handoff `omitted for this negative scenario`, revision cycle `none`, and the injected fixture path.
4. Check: reviewer produces no verdict; response contains a stop-and-request for DEVELOPER OUTPUT.

---

### 04 - Reviewer Blocks on Missing EXPLORER OUTPUT

1. Load scenario: `.ai/tests/scenarios/04-reviewer-blocks-missing-explorer.md`
2. Inject fixture: `fixtures/developer-output-valid.md`
3. Invoke Stage 3 (reviewer) with the reviewer template, the scenario path, the spec, Explorer handoff `omitted for this negative scenario`, the complete DEVELOPER OUTPUT fixture, revision cycle `none`, and the injected fixture path.
4. Check: reviewer produces no verdict; response contains a stop-and-request for EXPLORER OUTPUT.

---

### 05 - No Existing Context

1. If `pages/ContactUsPage.ts` or `tests/ui/contact.spec.ts` already exists and was not created by this scenario, mark `SKIP` with reason `dirty scenario target`.
2. Load scenario: `.ai/tests/scenarios/05-no-existing-context.md`
3. Invoke Stage 1 (explorer) with the explorer template, the scenario path, the Contact Us spec, target `Contact Us form submission flow`, mode `offline`, and injected fixtures `none`.
4. Invoke Stage 2 (developer) with the developer template, the scenario path, the spec, the complete EXPLORER OUTPUT, reviewer findings `none`, and the offline mode instruction above.
5. Invoke Stage 3 (reviewer) with the reviewer template, the scenario path, the spec, the complete EXPLORER OUTPUT, the complete DEVELOPER OUTPUT, revision cycle `none`, and injected fixtures `none`.
6. Check: explorer explicitly surfaces absence of existing page/test coverage; developer lists new files; reviewer produces a verdict.
7. Delete `pages/ContactUsPage.ts` and `tests/ui/contact.spec.ts` if the scenario created them.

---

### 06 - Raw Locator Violation

1. Load scenario: `.ai/tests/scenarios/06-raw-locator-violation.md`
2. Inject fixture: `fixtures/explorer-output-valid.md`
3. Invoke Stage 2 (developer) with the developer template, the scenario path, the spec including the trick instruction, the complete EXPLORER OUTPUT fixture, reviewer findings `none`, and the offline mode instruction above.
4. Check: developer either fixes the violation before handing off (lint passes) or stops and surfaces the DSL constraint. A DEVELOPER OUTPUT with `npm run lint - failed` is a test failure.
5. Clean any files modified or created by Stage 2.

---

### 07 - Needs Revision Loop

**Cycle 1:**
1. Load scenario: `.ai/tests/scenarios/07-needs-revision-loop.md`
2. Inject fixtures: `fixtures/explorer-output-valid.md` + `fixtures/developer-output-lint-fail.md`
3. Invoke Stage 3 (reviewer) with the reviewer template, the scenario path, the spec, both complete fixture blocks, revision cycle `cycle 1`, and both injected fixture paths.
4. Check: verdict is `Needs revision` with a Blocking finding.

**Cycle 2:**
5. Invoke Stage 2 (developer) with the developer template, the scenario path, the spec, the complete EXPLORER OUTPUT fixture, Cycle 1 reviewer findings, and the offline mode instruction above.
6. Invoke Stage 3 (reviewer) with the reviewer template, the scenario path, the spec, the complete EXPLORER OUTPUT fixture, the Cycle 2 DEVELOPER OUTPUT, revision cycle `cycle 2`, and injected fixtures as applicable.
7. Check: verdict is `Approve` or `Approve with minor fixes`.
8. Clean any files modified or created by Stage 2.

---

### 08 - Max Revision Cycles

**Cycle 1:**
1. Load scenario: `.ai/tests/scenarios/08-max-revision-cycles.md`
2. Inject: `fixtures/explorer-output-valid.md` + `fixtures/developer-output-lint-fail.md`
3. Invoke Stage 3 (reviewer) with the reviewer template, the scenario path, the spec, both complete fixture blocks, revision cycle `cycle 1`, and both injected fixture paths. Check: `Needs revision`.

**Cycle 2:**
4. Re-inject `fixtures/developer-output-lint-fail.md` as the new developer output.
5. Invoke Stage 3 (reviewer) with the reviewer template, the scenario path, the spec, the complete EXPLORER OUTPUT fixture, the re-injected DEVELOPER OUTPUT fixture, revision cycle `cycle 2`, and both injected fixture paths. Check: `Needs revision` again.

**Escalation:**
6. Do not initiate Cycle 3. Surface the blocker to the user.
7. Check: no third cycle; escalation message present.

---

### 09 - Reviewer Rejects

1. Load scenario: `.ai/tests/scenarios/09-reviewer-rejects.md`
2. Inject: `fixtures/explorer-output-valid.md` + the inline mismatched DEVELOPER OUTPUT from the scenario card.
3. Invoke Stage 3 (reviewer) with the reviewer template, the scenario path, the spec, the complete EXPLORER OUTPUT fixture, the complete inline mismatched DEVELOPER OUTPUT, revision cycle `none`, and injected fixtures as applicable.
4. Check: verdict is `Reject`; findings table contains a Blocking spec-mismatch finding.

---

## Recording Results

After each scenario, record the result:

| Scenario | Result | Notes |
|---|---|---|
| 01 | | |
| 02 | | |
| 03 | | |
| 04 | | |
| 05 | | |
| 06 | | |
| 07 | | |
| 08 | | |
| 09 | | |

Results: `PASS`, `FAIL`, or `SKIP` (with reason).
