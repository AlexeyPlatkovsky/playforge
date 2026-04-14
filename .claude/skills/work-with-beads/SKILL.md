---
name: work-with-beads
description: Project rules for tracking work in the bd (beads) issue tracker. Use at the start of any non-trivial task and at task completion. Owns all bd-related procedure for this repo.
---

# Work With Beads

This skill is the **only** place in the project that defines bd usage. Other files (AGENTS.md, manager, workflows, task-ready) point here.

For the bd command reference, run `bd prime`. This skill adds the project overlay on top.

## Project Conventions

- **IDs are sequence-issued.** Always pass `--id` manually on create.
  - Top-level beads use `cpw-NNN` with a zero-padded three-digit sequence (for example `cpw-001`).
  - Before every create, scan `bd list`, find the highest existing number at the target hierarchy level, increment it, and pass the result via `--id`.
  - Children use dotted suffixes with counters scoped to their direct parent:
    - Features under epic `cpw-001`: `cpw-001.1`, `cpw-001.2`, ...
    - Tasks under feature `cpw-001.1`: `cpw-001.1.1`, `cpw-001.1.2`, ...
  - Child counters are independent per parent. Creating `cpw-001.2` does not affect the next task under `cpw-001.1`.
- **Hierarchy**: epic → feature → task. Set the parent at create time with `--parent <id>`. The dotted ID then reflects the hierarchy. Do not rely on `link --type parent-child` after the fact.
- **Sizing**:
  - **Epic** — multi-area or migration-level (≈ T3). Must contain 2+ features. Never wrap a single feature.
  - **Feature** — one cohesive capability (≈ T2 or large T1). Has either 0 child tasks or 2+ child tasks. A feature that would split into exactly one task is just a task.
  - **Task** — one focused unit, roughly one PR's worth (≈ T1, occasionally a meaty T0).
  - bd's `bug`, `chore`, `decision` types are allowed when they fit better than `task`.
- **Floor**: T0 work happens off-bead. Do not create a bead for a five-minute trivial edit.
- **Ceiling**: a task that lists multiple distinct capabilities is too big. Promote to feature with child tasks.

## When This Skill Runs

| Tier | Action |
|---|---|
| T0 | Skip. No bead. |
| T1 / T2 / T3 | Run after `manager` emits the tier line, before the workflow body starts. Run again at `task-ready` to close. |

The session has at most one **active bead** at a time. Once claimed, every subsequent prompt in the session stays on it until the user explicitly says otherwise.

## Start Of A Non-Trivial Task

1. **Check for an active bead in this session.** If one exists, keep using it. Do not re-prompt unless the user signals a switch (phrases like "new task", "new bead", "unrelated", "start fresh"). When the signal is ambiguous, ask once.
2. **No active bead → search first.** Run `bd search "<keywords from request>"` and `bd list --status=open --status=in_progress --desc-contains "<keyword>"` to surface candidates. Show the top 1–3 with ID, type, title, status.
3. **Ask the user**, listing the candidates plus an explicit "[N] new bead". Never auto-attach.
4. **If new**, propose type/title/parent/blocks before creating:
   - Type per the sizing rules above.
   - Parent: required for `feature` (epic) and `task` (feature, when the feature exists). When no epic/feature exists yet and the work warrants one, create the parent first.
   - Blocks: ask only if the Q3 search surfaced an overlapping open bead. Otherwise default to none.
5. **Create**:
   - First scan `bd list` and compute the next ID for the target hierarchy level:
     - Top-level create: highest `cpw-NNN` + 1
     - Feature create: highest `<epic>.<n>` under that epic + 1
     - Task create: highest `<feature>.<n>` under that feature + 1
   - Then create with the explicit ID:
   ```
   bd create --id "cpw-NNN" --title "..." --description "..." --type <epic|feature|task|bug|chore|decision> --priority <0..4> [--parent <id>] [--deps blocks:<id>,...]
   ```
   Priority is `0..4` (`P0`=critical, `P2`=default, `P4`=backlog). Never use `high|medium|low`.
6. **Mid-task discoveries** that need their own bead: create with `--deps discovered-from:<active-bead>`. No prompt needed.
7. **Claim**: `bd update <id> --claim`. This marks `in_progress` and assigns to the current actor so `bd ready` stops surfacing it.
8. Record the active bead ID for the session.

## During The Task

- Append a note only on a real event:
  - Blocker found → `bd update <id> --status=blocked` and `bd note <id> "<what blocks it>"`
  - Design pivot from the plan → `bd note <id> "<decision + reason>"`
  - Newly discovered work → create a child or sibling bead with `discovered-from`, do not stretch the active bead's scope.
- Do not annotate routine progress. The diff and the plan file are the record.

## End Of A Non-Trivial Task

1. At `task-ready`, propose the close command:
   ```
   bd close <active-bead> [<discovered-children>] --suggest-next
   ```
2. Wait for user approval. Then close. Then commit. Then push (per `work-with-git`).
3. Surface what `--suggest-next` returns so the user can pick the next bead.

## Switching Beads Mid-Session

When the user signals a switch:

1. Decide what to do with the current bead — close it, leave it `in_progress`, or move it to `blocked`. Ask the user; do not assume.
2. Run the start-of-task flow for the new request from step 2.
3. Update the recorded active bead.

## Forbidden

- `bd edit` — opens `$EDITOR` and blocks the agent. Use `bd update` with field flags.
- Restating bd command reference in this file or any other — defer to `bd prime`.
- Running `bd hooks install` — auto-injecting `bd prime` into every session conflicts with the project's "one place for beads stuff" rule.
- Closing a bead and committing in one breath without user approval.
- Tracking task progress in `docs/plans/`. Plans capture *design*; bd captures *work*.

## Failure Modes

- `bd` not available → stop and report. The project requires bd.
- `.beads/` missing in the repo → stop and ask before running `bd init` (creating the DB is a project-shaping action, not a routine one).
- Cycle detected when adding a dep (`bd dep cycles`) → stop, surface the cycle, ask the user how to break it.
