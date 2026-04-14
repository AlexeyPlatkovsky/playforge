# Workflow: Repair Test

Use when an existing spec is failing or flaky. Covers both consistent failures and intermittent flakes — the reproducibility step branches to the right diagnosis path.

## Scope

- The failing spec and the pages/components it touches
- Fixtures or assertion helpers when the failure points to shared setup
- Do not edit `framework/` unless the root cause is a framework gap

## Steps

0. **Bead.** Ensure an active bead per `work-with-beads`.
1. **Reproduce.** Run the spec locally per `validate`. Note which path applies:
   - **Reproduces every time** → continue to step 2 (deterministic).
   - **Reproduces sometimes** → run several times to characterize the failure rate; note which axis varies (timing, order, data, network). Continue to step 2 with the flake characterization in hand.
   - **Cannot reproduce** → ask for the failing run's logs/trace, environment, and seed before guessing.
2. **Read.** Open the spec plus every page/component it uses. Confirm the failure mode from code, not from the symptom alone.
3. **Classify cause.** Pick the smallest matching layer:
   - DSL violation (raw `page.*`, missing helper, wrong abstraction)
   - Locator drift (selector no longer stable, name binding broken, lazy field)
   - Timing / race (assertion before state, missing wait helper, flake from ordering)
   - Test data (shared fixture state, account/data leakage between runs)
   - Framework gap (no helper exists where one is needed; flag for separate work)
4. **Fix at the correct layer.** Apply the fix where the cause lives — page/component for locator and DSL issues, fixture for data/setup, helper for repeated waits. Do not patch a symptom in the spec when the cause is in a page or component.
5. **Quarantine path.** If the cause is a known framework gap or environment instability and a fix is out of scope, mark the spec with a quarantine tag and open a tracking note. Do not silently skip.
6. **Self-review.** Run `review-automation-code` if the fix touched page/component APIs.
7. **Validate.** Re-run the spec. For an intermittent failure, run it enough times to be confident the flake is gone (state the count). Repair loop up to 3 times. If still failing, report blocker and recommended next step.
8. **Task ready.** Run `task-ready` and report per its `§Reporting Format`, plus:
   - Original failure mode (consistent / intermittent + observed rate)
   - Cause classification
   - Layer fixed
   - Re-run count for flake confirmation

## Escalate

- Root cause sits in `framework/core/**`, fixtures, reporting, ESLint, or `assertions/soft.ts` → escalate the framework portion to `high-risk.md`. Keep the spec fix in this workflow.

## Do Not

- Add `test.skip` or arbitrary timeouts to mask a flake without a quarantine note.
- Move test-only logic into `framework/` to make a single failure go away.
- Bundle unrelated cleanup into the repair diff.
