# Hardening And Readiness

Recorded on `2026-04-14` after the `cpw-004` and `cpw-005` reference-flow implementation work.

## Parallel Stress Pass

Command:

```bash
BASE_URL=http://127.0.0.1:3407 npx playwright test tests/ui tests/framework --grep @ui --workers=4 --repeat-each=3
```

Result:

- 36 browser tests passed
- 4 workers
- 3 repeats per spec
- total wall time: about 9.5s
- Playwright HTML, trace, video, and Allure wiring remained stable during the repeated run

Interpretation:

- The current page/component DSL, fixture server, and smoke app are stable under file-level parallel execution at the current suite size.
- No flake was observed in the repeated browser pass.

## `xLocator` Proxy Benchmark

Command:

```bash
BASE_URL=http://127.0.0.1:3407 npx playwright test tests/unit/xLocator.benchmark.spec.ts
```

Benchmark shape:

- 50,000 chained locator operations per sample
- compare raw locator chaining, wrapped `xLocator` chaining, and a `rawLocator(...)` fallback taken once from a wrapped locator

Measured averages:

| Case | Average |
|---|---|
| raw locator chain | 1.486 ms |
| wrapped `xLocator` chain | 25.173 ms |
| `rawLocator(...)` fallback from `xLocator` | 1.407 ms |

Guidance:

- Keep `xLocator` as the public DSL because the named logging and chain metadata are the default behavior authors rely on.
- In internal hot loops that create large numbers of derived locators, unwrap once with `rawLocator(...)` and stay raw inside the loop body.
- Do not widen that fallback into page/component authoring guidance; it is an internal optimization path, not the primary API.

## Deferred Item Decisions

The bd database was read-only in this session because another process held the embedded Dolt writer lock, so these decisions are recorded here even where a follow-up bead would normally be created.

| Topic | Decision | Rationale |
|---|---|---|
| highlight refinements | defer | Current highlighting is sufficient for the reference flows; no failure evidence justified changing it now. |
| slow-mo support | defer | No repeated-run or trace evidence showed a debugging gap that warrants a runtime contract change. |
| TestRail tag parsing | defer | The repo has no TestRail integration path yet, so adding parsing now would be speculative. |
| remote-grid support | defer | Current config and smoke app are local-runner oriented; grid support should be tracked separately once a real target exists. |
| dynamic component roots | keep deferred | The new example flows were expressible with fixed scoped roots, so a broader component-root contract is still unproven. |
| `softGroup` on non-assertion exceptions | keep current behavior | Non-assertion failures should still stop execution immediately; only assertion-mode switching is intentionally softened. |
| `xPage.waitForReady()` hook | defer | `isOpened()` remains sufficient for the current pages and adding another readiness hook would be speculative. |
