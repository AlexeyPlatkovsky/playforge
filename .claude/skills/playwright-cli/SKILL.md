---
name: playwright-cli
description: Automates browser interactions for web testing, form filling, screenshots, state management, and DOM capture. Use when the user needs live browser discovery or web app interaction.
allowed-tools: Bash(playwright-cli:*)
---

# Browser Automation With playwright-cli

## Quick Start

```bash
playwright-cli open
playwright-cli goto https://playwright.dev
playwright-cli snapshot
playwright-cli click e15
playwright-cli fill e5 "user@example.com"
playwright-cli press Enter
playwright-cli close
```

## Core Commands

```bash
playwright-cli open https://example.com/
playwright-cli goto https://example.com/
playwright-cli click e3
playwright-cli dblclick e7
playwright-cli fill e5 "value"
playwright-cli hover e4
playwright-cli check e12
playwright-cli uncheck e12
playwright-cli snapshot
playwright-cli screenshot
playwright-cli eval "document.title"
playwright-cli close
```

## Tabs And Storage

```bash
playwright-cli tab-new
playwright-cli tab-list
playwright-cli tab-select 0
playwright-cli state-save auth.json
playwright-cli state-load auth.json
playwright-cli cookie-list
playwright-cli localstorage-list
playwright-cli sessionstorage-list
```

## Network And Debugging

```bash
playwright-cli route "**/*.jpg" --status=404
playwright-cli route-list
playwright-cli unroute
playwright-cli console
playwright-cli network
playwright-cli tracing-start
playwright-cli tracing-stop
```

## Rules

- Store named snapshots under `.playwright/snapshots/`.
- Use environment variables for credentials; never hardcode them into generated code.
- Save browser state only when it materially reduces repeated login/setup work.
- If the global binary is unavailable, use `npx playwright-cli`.
