# create-test-from-spec

Staged pipeline for generating a test from a specification in playforge.

## When To Use

Use this pipeline when the task is:

- writing a new test from a user story, acceptance criterion, or feature specification
- adding test coverage for an existing page or component from a described scenario

Do not use this pipeline for:

- refactoring existing tests (use `code-refactoring`)
- pure page object or component work without a test spec (use `framework-feature-implementation`)
- one-line obvious test additions classified as trivial (proceed directly)

## Execution Sequence

Stages execute sequentially. Each stage must complete its output contract before the next stage starts.
Invoke each stage with the shared prompt templates in `.ai/docs/templates/pipeline-stage-prompts/`.
Fill every required template field explicitly; do not rely on an agent to infer the spec, handoff blocks, or mode from surrounding conversation.

Before invoking a stage, run the preflight in `.ai/docs/templates/pipeline-stage-prompts/README.md`.
If required input is missing outside an intentional negative scenario, fix the prompt before starting the stage.

---

### Stage 1 — Explorer Agent

**Agent:** `.ai/agents/explorer/AGENT.md`
**Prompt template:** `.ai/docs/templates/pipeline-stage-prompts/explorer.md`

**Input:** test specification + target page, component, or flow name

**Output (required before Stage 2):**
```
EXPLORER OUTPUT block
```

If the spec is ambiguous after inspection, the explorer must stop and surface the ambiguity before Stage 2 begins.

---

### Stage 2 — Developer Agent

**Agent:** `.ai/agents/developer/AGENT.md`
**Prompt template:** `.ai/docs/templates/pipeline-stage-prompts/developer.md`

**Input:** test specification + `EXPLORER OUTPUT` block from Stage 1

**Runs:** checks required by `.ai/conventions/verification.md`:
— `npm run typecheck`, `npm run lint`, and `npm run test:ui` scoped to the generated spec

**Output (required before Stage 3):**
```
DEVELOPER OUTPUT block
  npm run typecheck    — passed / failed
  npm run lint         — passed / failed
  Browser verification — passed / failed / skipped
  Accessibility smoke  — added report-only / skipped — package not installed / not applicable
```

Developer must not hand off if any non-skipped check fails.

---

### Stage 3 — Test Reviewer Agent

**Agent:** `.ai/agents/test-reviewer/AGENT.md`
**Prompt template:** `.ai/docs/templates/pipeline-stage-prompts/test-reviewer.md`

**Input:** `EXPLORER OUTPUT` block from Stage 1 + `DEVELOPER OUTPUT` block from Stage 2

**Output (required before closure):**
```
Verdict + Findings table
```

If verdict is **Approve**: advance to closure.
If verdict is **Approve with minor fixes**: return to Stage 2 with the findings table. Developer applies fixes, re-runs all required checks, and produces a new `DEVELOPER OUTPUT` block. No second reviewer pass is required — advance to closure once the new output block shows all checks passed.
If verdict is **Needs revision**: return to Stage 2 (developer agent) with the findings table as additional input. Repeat at most two revision cycles; if blocking issues remain after two cycles, stop and surface to the user.
If verdict is **Reject**: return to Stage 1 (re-run explorer for the revised scope).

---

## Closure Gate

The pipeline is ready for closure — manager appends `task-complete` — only when:

- All stage handoff artifacts are explicit (no implicit context passing)
- Reviewer verdict is **Approve** or **Approve with minor fixes** (minor fixes resolved)
- The last `DEVELOPER OUTPUT` block shows all required checks passed
