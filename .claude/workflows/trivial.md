# Workflow: Trivial (T0)

Use for single-file or low-risk edits: docs, naming, formatting, narrow bug fixes.

## Steps

1. Make the change inline. No subagents.
2. Run the minimal check from the `validate` skill.
3. Run `task-ready` only if the change touches runnable code.
4. Report: files changed, what ran, anything skipped.

## Do Not

- Spawn `architect`, `code-writer`, `code-reviewer`, or `writer` subagents.
- Produce a plan file.
- Run broad suites.
- Create a bead. T0 work stays off-bead per `work-with-beads`.
