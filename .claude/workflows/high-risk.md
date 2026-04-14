# Workflow: High Risk (T2)

Use when the change touches framework core, `assertions/soft.ts`, fixtures, reporting, Playwright config, ESLint rules, or any shared DSL contract.

## Steps

1. Ensure an active bead per `work-with-beads`.
2. Run `architect` subagent. Produce a plan file per `work-with-docs`.
3. For framework changes, follow `refactor` TDD: write or update the protecting unit test first.
4. Run `code-writer` subagent to implement steps in order. Owns validation via `validate`.
5. Collect the real changed-file list and diff from the worktree.
6. Run `code-reviewer` subagent against the diff.
7. Loop rule:
   - **CRITICAL or HIGH** findings → send back to `code-writer` subagent, fix, re-review.
   - **MEDIUM** findings → report only; do not loop automatically.
   - Hard cap: 3 `code-writer` / `code-reviewer` subagents rounds. After that, stop and report unresolved findings.
8. Run `task-ready`.
9. Run `writer` subagent only if public usage, setup, extension points, configuration, or workflow changed.

## Do Not

- Skip the protecting test for shared-behavior changes.
- Bundle unrelated cleanup into the diff.
- Allow parallel edits to the same file across roles.
