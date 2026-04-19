# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: framework/assertions.spec.ts >> softGroup keeps executing after a failing assertion @ui
- Location: tests/framework/assertions.spec.ts:59:5

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('#title')
Expected: "Not Dashboard"
Received: "Dashboard"
Timeout:  200ms

Call log:
  - Expect "soft toHaveText" with timeout 200ms
  - waiting for locator('#title')
    3 × locator resolved to <h1 id="title" data-kind="heading">Dashboard</h1>
      - unexpected value "Dashboard"

```

```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('#status')
Expected: "pending"
Received: "signed-in"
Timeout:  200ms

Call log:
  - Expect "soft toHaveText" with timeout 200ms
  - waiting for locator('#status')
    3 × locator resolved to <p id="status">signed-in</p>
      - unexpected value "signed-in"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - heading "Dashboard" [level=1] [ref=e2]
  - paragraph [ref=e3]: signed-in
  - button "Go" [ref=e4]
  - list [ref=e5]:
    - listitem [ref=e6]: one
    - listitem [ref=e7]: two
    - listitem [ref=e8]: three
```

# Test source

```ts
  1  | import { type AssertionOptions, assertionStep, displayName, matcherOptions, resolveTitle } from "./_step";
  2  | import { currentExpect } from "./soft";
  3  | import type { xLocator } from "../framework/core/xLocator";
  4  | 
  5  | export async function assertTextEquals(loc: xLocator, expected: string, options?: AssertionOptions): Promise<void> {
  6  |   const title = resolveTitle(`${displayName(loc)} text equals "${expected}"`, options);
  7  |   await assertionStep(title, async () => {
> 8  |     await currentExpect()(loc).toHaveText(expected, matcherOptions(options));
     |                                ^ Error: expect(locator).toHaveText(expected) failed
  9  |   });
  10 | }
  11 | 
  12 | export async function assertTextContains(loc: xLocator, expected: string, options?: AssertionOptions): Promise<void> {
  13 |   const title = resolveTitle(`${displayName(loc)} text contains "${expected}"`, options);
  14 |   await assertionStep(title, async () => {
  15 |     await currentExpect()(loc).toContainText(expected, matcherOptions(options));
  16 |   });
  17 | }
  18 | 
  19 | export async function assertValueEquals(loc: xLocator, expected: string, options?: AssertionOptions): Promise<void> {
  20 |   const title = resolveTitle(`${displayName(loc)} value equals "${expected}"`, options);
  21 |   await assertionStep(title, async () => {
  22 |     await currentExpect()(loc).toHaveValue(expected, matcherOptions(options));
  23 |   });
  24 | }
  25 | 
```