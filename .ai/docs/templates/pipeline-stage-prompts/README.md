# Pipeline Stage Prompt Templates

These templates define the invocation envelope for `create-test-from-spec` stages.
They are shared by regular pipeline execution and `.ai/tests` drift checks.

Use them when starting a stage agent. Fill every template field explicitly, even
when the value is `none`, `omitted for negative scenario`, or `not applicable`.

## Preflight

Before invoking a stage, verify the prompt contains the required inputs:

- Explorer: `Spec` and `Target page/component/flow`
- Developer: `Spec` and an `EXPLORER OUTPUT` block, unless the scenario is
  intentionally testing missing explorer input
- Test reviewer: `EXPLORER OUTPUT` and `DEVELOPER OUTPUT` blocks, unless the
  scenario is intentionally testing a missing handoff block

If a required input is absent outside an intentional negative scenario, stop
before starting the stage and fix the prompt.

