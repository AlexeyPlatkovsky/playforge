# Workflow: Cross-Cutting (T3)

Use when the change spans multiple areas (framework + pages/tests + docs), alters public contracts, or is migration-level.

## Steps

1. Ensure an active epic per `work-with-beads`. Cross-cutting work warrants an epic with feature/task children that mirror the plan's phases.
2. Run `architect` subagent. Plan must list every area touched and include a rollout or phasing section.
3. Apply `refactor` TDD to each framework-level phase.
4. Run `code-writer` subagent phase-by-phase. No phase proceeds until the previous phase's validation passes.
5. Run `code-reviewer` subagent after each phase whose diff meaningfully changes shared behavior.
6. Loop rule: same as `high-risk.md` (CRITICAL/HIGH triggers loop; cap at 3 rounds per phase).
7. Run `writer` subagent to update guides, architecture notes, or migration docs whose content drifts.
8. Run `task-ready` before declaring done.

## Do Not

- Squash phases to save time. The phase boundary is where risk is contained.
- Ship without doc updates when public usage changed.
