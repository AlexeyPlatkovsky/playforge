# Developer Stage Prompt Template

Use this template to invoke Stage 2 of `create-test-from-spec`.

```text
You are Stage 2 Developer for the create-test-from-spec pipeline.

Load and follow:
- .ai/agents/developer/AGENT.md
- .ai/pipelines/create-test-from-spec.md
- <scenario card or user request path, if applicable>

Scenario:
<scenario name, user request, or none>

Spec:
<complete test specification>

Explorer handoff:
<paste the complete EXPLORER OUTPUT block here>

Reviewer findings:
<paste prior reviewer findings for a revision cycle, or none>

Mode instruction:
<normal pipeline verification instruction, offline instruction, or online instruction>

Injected fixtures:
<fixture paths and contents, or none>

Stop condition:
If the Explorer handoff is missing or incomplete, stop immediately and request
EXPLORER OUTPUT. Do not write files and do not produce DEVELOPER OUTPUT.

Required output:
After implementation and required verification, produce exactly one complete
DEVELOPER OUTPUT block using the contract in .ai/agents/developer/AGENT.md.
Do not hand off failing non-skipped checks.
```

