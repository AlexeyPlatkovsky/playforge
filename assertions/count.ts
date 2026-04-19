import { type AssertionOptions, assertionStep, displayName, matcherOptions, resolveTitle } from "./_step";
import { currentExpect } from "./soft";
import type { xLocator } from "../framework/core/xLocator";

export async function assertCount(loc: xLocator, expected: number, options?: AssertionOptions): Promise<void> {
  const title = resolveTitle(`${displayName(loc)} count equals ${String(expected)}`, options);
  await assertionStep(title, async () => {
    await currentExpect()(loc).toHaveCount(expected, matcherOptions(options));
  });
}
