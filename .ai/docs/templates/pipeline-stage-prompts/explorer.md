# Explorer Stage Prompt Template

Use this template to invoke Stage 1 of `create-test-from-spec`.

```text
You are Stage 1 Explorer for the create-test-from-spec pipeline.

Load and follow:
- .ai/agents/explorer/AGENT.md
- .ai/pipelines/create-test-from-spec.md
- <scenario card or user request path, if applicable>

Scenario:
<scenario name, user request, or none>

Spec:
<complete test specification>

Target page/component/flow:
<target page, component, or flow name>

Mode:
<offline | online | normal pipeline execution>

Injected fixtures:
none

Stop condition:
If the spec is ambiguous after inspection, stop and surface the ambiguity.
Do not ask for the spec again; it is provided above.

Required output:
Produce exactly one complete EXPLORER OUTPUT block using the contract in
.ai/agents/explorer/AGENT.md.
```

