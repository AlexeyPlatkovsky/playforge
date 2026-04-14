---
name: explain-code
description: Explains code with visual diagrams and concrete flow. Use when the user asks how the Playwright framework or application model works.
---

When explaining code:

1. Start from the files and methods that answer the question directly.
2. Explain the real control flow and data flow before discussing abstractions.
3. Include a small ASCII diagram when it clarifies ownership, initialization, or call flow.
4. Call out assumptions, extension points, and failure modes when relevant.

## Default Structure

1. **What it is**: role of the class or subsystem
2. **How it flows**: step-by-step execution path with file references
3. **Key collaborators**: nearby types, fixtures, helpers, or config
4. **Gotchas**: lifecycle, timing, or DSL constraints

## Style Rules

- Do not invent behavior that is not visible in code.
- Label inferences as inferences.
- Prefer concrete file and method references over generic commentary.
- Keep diagrams compact and ASCII-only.
