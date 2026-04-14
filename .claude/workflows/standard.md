# Workflow: Standard (T1)

Use for non-trivial work in a single area that does not touch framework core, fixtures, reporting, or ESLint rules.

## Steps

1. Ensure an active bead per `work-with-beads`.
2. State a short inline plan (3–7 bullets). No plan file, no `architect` subagent.
3. Implement directly, or delegate to `code-writer` subagent only when the change spans several files and a focused implementer helps.
4. Follow the relevant source of truth:
   - New spec from a case → `.claude/workflows/author-test.md`
   - Failing or flaky spec → `.claude/workflows/repair-test.md`
   - Test rules → `write-test`
   - UI automation conventions → `docs/conventions/page-objects.md`, `docs/conventions/components.md`
5. Run validation via `validate`.
6. Material UI changes under `pages/`, `pages/components/`, `tests/ui/`, or `tests/framework/` → run `review-automation-code`.
7. Run `task-ready`.
8. Report per `task-ready §Reporting Format`.

## Escalate To T2 When

- The change starts touching `framework/core/**`, `assertions/soft.ts`, fixtures, reporting, or ESLint rules.
- Reviewer surfaces CRITICAL or HIGH findings twice in a row.

## Do Not

- Run the full `architect` → `code-writer` → `code-reviewer` subagents loop by default.
- Produce a `docs/plans/` file for in-area feature work unless the user asks.
