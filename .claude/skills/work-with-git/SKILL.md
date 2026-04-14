---
name: work-with-git
description: Branch strategy and git safety rules for this project. Use when initializing git, creating branches, preparing commits, or deciding how to structure git work.
---

## Inspect First

Before suggesting git actions, inspect:

```bash
git status --short
git branch --show-current
git branch --list
git symbolic-ref refs/remotes/origin/HEAD
```

## Branch Decision Rule

- Trivial work: branch optional
- Non-trivial work: suggest a focused branch unless the user explicitly asked to stay on `main`

## Naming

| Prefix | When to use |
|---|---|
| `feature/<name>` | New features |
| `fix/<name>` | Bug fixes |
| `refactor/<name>` | Internal restructuring |
| `docs/<name>` | Documentation only |
| `ai/<name>` | AI-assisted changes when no better prefix fits |

## Safety Rules

- Never commit without explicit user permission.
- Never push without explicit user permission.
- Never pull, switch branches, or rewrite history automatically.
- If the user explicitly requires `main`, stay there and do not create a side branch.
- Keep commits focused and avoid unrelated files from a dirty worktree.
