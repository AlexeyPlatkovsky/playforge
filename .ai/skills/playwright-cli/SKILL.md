---
name: playwright-cli
description: Use Playwright Agent CLI for live browser exploration when repository evidence is insufficient. Supports Explorer agent workflows that need to inspect page state, accessibility snapshots, element refs, roles, accessible names, text, labels, stable attributes, console output, network evidence, screenshots, traces, or generated locator evidence without modifying project files.
---

# playwright-cli

Use this skill only for live UI exploration. Prefer repository evidence first; run browser commands only when files, docs, page objects, tests, helpers, and fixtures do not reliably answer the current question.

Official references:
- https://playwright.dev/agent-cli/introduction
- https://playwright.dev/agent-cli/snapshots
- https://playwright.dev/agent-cli/commands/navigation
- https://playwright.dev/agent-cli/commands/interaction
- https://playwright.dev/agent-cli/commands/console-eval

## Command Entry

Use `playwright-cli` for commands.

On Windows PowerShell, if the `.ps1` shim is blocked by execution policy, use `playwright-cli.cmd` for the same command.

Before relying on a command not listed here, run:

```powershell
playwright-cli --help
playwright-cli --help <command>
```

If the CLI is unavailable, browser installation is missing, or the target site requires unavailable credentials, stop live exploration and report the affected findings as `UNKNOWN`.

Do not run `install-browser`, `install`, or other download/setup commands without user confirmation.

## Explorer Workflow

1. Open the smallest relevant page:

```powershell
playwright-cli open <url>
```

Use `--headed` only when visual confirmation is required. Use an isolated session for unrelated flows:

```powershell
playwright-cli -s=<short-flow-name> open <url>
```

2. Capture page state:

```powershell
playwright-cli snapshot
playwright-cli snapshot --depth=4
playwright-cli snapshot <ref-or-selector>
```

Use the snapshot as primary evidence. It contains accessibility-tree structure, roles, accessible names, visible text, and element refs. Re-run `snapshot` after navigation or any action that changes the page; refs are valid only for the current state.

3. Interact only as much as needed to answer the missing question:

```powershell
playwright-cli click <ref>
playwright-cli fill <ref> "<text>"
playwright-cli fill <ref> "<text>" --submit
playwright-cli select <ref> "<value>"
playwright-cli check <ref>
playwright-cli hover <ref>
```

Prefer refs from the latest snapshot. Use selectors or Playwright locators only when a ref is unavailable and the selector itself is the evidence being checked.

4. Inspect attributes or computed state when snapshots are insufficient:

```powershell
playwright-cli eval "(el) => el.getAttribute('data-testid')" <ref>
playwright-cli eval "(el) => el.getAttribute('aria-label')" <ref>
playwright-cli eval "() => document.title"
```

Use `generate-locator <ref>` only as locator evidence for a recommendation. Do not paste generated raw Playwright locator code into tests; playforge tests must still use the Component-DSL.

5. Check diagnostics only when relevant:

```powershell
playwright-cli console error
playwright-cli requests
playwright-cli request <index>
playwright-cli screenshot --filename <name>.png
playwright-cli tracing-start
playwright-cli tracing-stop
```

Use screenshots for visual layout, canvas, charts, or states that accessibility snapshots cannot represent. Use traces only for short flows where timing, navigation, network, or console sequence matters.

6. Clean up when exploration is complete:

```powershell
playwright-cli close
```

Use `close-all` only when the browser sessions were opened for the current task.

## Safety Rules

- Do not create or edit repository files.
- Do not execute full test suites.
- Do not perform destructive application actions such as deleting records, submitting purchases, sending real emails, or changing account state.
- Do not store credentials or sensitive session data in project files.
- Do not persist selectors into code; report evidence for the Developer stage.
- Keep navigation and interaction minimal.
- Prefer accessibility snapshots over screenshots for structure and selector discovery.

## Evidence To Report

When using this skill from Explorer, include evidence in `EXPLORER OUTPUT` with one of:

- role plus accessible name
- visible text or label
- stable attribute such as `data-testid`, `data-qa`, `aria-label`, `name`, or `id`
- parent/child context from a scoped snapshot
- console, network, screenshot, or trace artifact path
- limitation marked as `UNKNOWN`

Every live finding must be marked `CONFIRMED_FROM_LIVE_UI`. If a finding depends on a snapshot file, include the snapshot path printed by the CLI.
