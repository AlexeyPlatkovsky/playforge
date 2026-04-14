---
name: work-with-docs
description: Rules for creating and maintaining project documentation. Use when writing or editing plans, guides, ADRs, or migration notes.
---

## Folder Conventions

| Folder | What goes there |
|---|---|
| `docs/plans/` | Plans and implementation roadmaps |
| `docs/guides/` | User-facing how-to docs |
| `docs/architecture/` | ADRs and structural overviews |
| `docs/cases/` | Test case inputs for `ai-write-test` |
| `docs/migration/` | Selenium-to-Playwright migration notes and side-by-side examples |
| `docs/reviews/` | Review reports when a reviewer writes one |

## Plan Naming

`docs/plans/yyyy-MM-dd-<ai-agent-name>-<plan-name>.md`

Use today's absolute date and kebab-case.

## Plan Template

```markdown
# <Plan Title>

**Status:** draft | in-progress | done
**Branch:** `<prefix>/<name>` or `main`
**Date:** `yyyy-MM-dd`
**Scope:** <one sentence>

---

## Phase Status

| Phase | Status | Outcome |
|---|---|---|
| 1. <Phase name> | 🟡 Planned | <expected result> |

## Overview

<1-2 sentences>

## Steps

### Step N - <Title> (<risk: Low/Medium/High>)

**Files:** `path/to/file.ts`
**Problem:** <what is wrong>
**Change:** <what to do>
**Validation:** `npx ...`
```

## Format Rules

- Keep each doc under 150 lines.
- Prefer tables and bullets over long prose.
- Use code blocks for commands and examples.
- Use absolute dates.
- Link to existing docs rather than duplicating content.

## When To Update Existing Docs

- Update `README.md` when public setup or capability statements change.
- Update `docs/guides/` when user-facing usage or conventions change.
- Add `docs/migration/` content when Selenium-era habits need a Playwright translation guide.
