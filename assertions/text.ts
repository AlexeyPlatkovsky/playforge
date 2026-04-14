import { type AssertionOptions, assertionStep, displayName, matcherOptions, resolveTitle } from "./_step";
import { currentExpect } from "./soft";
import type { xLocator } from "../framework/core/xLocator";

export async function assertTextEquals(loc: xLocator, expected: string, options?: AssertionOptions): Promise<void> {
  const title = resolveTitle(`${displayName(loc)} text equals "${expected}"`, options);
  await assertionStep(title, async () => {
    await currentExpect()(loc).toHaveText(expected, matcherOptions(options));
  });
}

export async function assertTextContains(loc: xLocator, expected: string, options?: AssertionOptions): Promise<void> {
  const title = resolveTitle(`${displayName(loc)} text contains "${expected}"`, options);
  await assertionStep(title, async () => {
    await currentExpect()(loc).toContainText(expected, matcherOptions(options));
  });
}

export async function assertValueEquals(loc: xLocator, expected: string, options?: AssertionOptions): Promise<void> {
  const title = resolveTitle(`${displayName(loc)} value equals "${expected}"`, options);
  await assertionStep(title, async () => {
    await currentExpect()(loc).toHaveValue(expected, matcherOptions(options));
  });
}
