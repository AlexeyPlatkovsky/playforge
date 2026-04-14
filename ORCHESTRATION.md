# Orchestration Policy

> Main agent only. Subagents do not follow these instructions; they have their own definitions in `.claude/agents/`.

## Default: Work Directly in the Current Thread

Spawning an agent has overhead. Unless delegation clearly improves the outcome, work inline.

Never spawn an agent for:

- A single file or small related set of changes
- Docs, comments, naming, or formatting only
- A narrow, low-risk bug fix
- Anything answerable or fixable faster inline than via delegation

## When Delegation Pays Off

Consider delegating when the task is non-trivial and at least one is true:

- Structured planning is needed before edits
- The implementation spans multiple phases and benefits from a focused implementer
- A post-implementation read-only review materially reduces risk
- Doc updates are needed alongside code changes

## Preferred Roles

| Role | When to use |
|---|---|
| `architect` | Non-trivial tasks needing a written implementation plan, risk analysis, or scope clarification before edits |
| `engineer` | Code changes in `framework/`, `assertions/`, `pages/`, `components/`, `tests/`, or `eslint-plugin-xframework/` |
| `code-reviewer` | After non-trivial implementation to surface CRITICAL/HIGH/MEDIUM/LOW findings |
| `writer` | When behavior, setup, architecture, configuration, or workflow changes require docs updates |

## Workflow For Non-Trivial Tasks

1. Classify the task using `AGENTS.md`.
2. Trivial: work directly. Stop here.
3. Non-trivial: run `architect` first unless the task is already fully specified and planning adds no value.
4. Run `engineer` to implement. Engineer owns validation.
5. Before `code-reviewer`, collect the real changed-file list and diff from the current worktree.
6. Run `code-reviewer` after implementation.
7. If `code-reviewer` finds CRITICAL, HIGH, or MEDIUM issues, send the findings back to `engineer`, fix them, and rerun `code-reviewer`.
8. Hard limit: 3 engineer/reviewer rounds. After that, stop looping and report unresolved findings.
9. Run `writer` only when docs need material updates.

## Constraints

- Do not spawn agents to bypass repo rules, validation steps, or approval requirements.
- Subagents follow the same `AGENTS.md` rules and matching local skills.
- Name the relevant skills explicitly when handing work off.
- Keep write ownership clear; avoid parallel edits to the same file.
