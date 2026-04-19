import type { Page } from "@playwright/test";

import { type AssertionOptions, assertionStep, matcherOptions, resolveTitle } from "./_step";
import { currentExpect } from "./soft";

export async function assertUrl(
  page: Page,
  expected: string | RegExp,
  options?: AssertionOptions
): Promise<void> {
  const label = expected instanceof RegExp ? expected.source : expected;
  const title = resolveTitle(`URL matches ${label}`, options);
  await assertionStep(title, async () => {
    await currentExpect()(page).toHaveURL(expected, matcherOptions(options));
  });
}
