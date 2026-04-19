import { type AssertionOptions, assertionStep, displayName, matcherOptions, resolveTitle } from "./_step";
import { currentExpect } from "./soft";
import type { xLocator } from "../framework/core/xLocator";

export async function assertVisible(loc: xLocator, options?: AssertionOptions): Promise<void> {
  const title = resolveTitle(`${displayName(loc)} is visible`, options);
  await assertionStep(title, async () => {
    await currentExpect()(loc).toBeVisible(matcherOptions(options));
  });
}

export async function assertHidden(loc: xLocator, options?: AssertionOptions): Promise<void> {
  const title = resolveTitle(`${displayName(loc)} is hidden`, options);
  await assertionStep(title, async () => {
    await currentExpect()(loc).toBeHidden(matcherOptions(options));
  });
}
