import { type AssertionOptions, assertionStep, displayName, matcherOptions, resolveTitle } from "./_step";
import { currentExpect } from "./soft";
import type { xLocator } from "../framework/core/xLocator";

export async function assertEnabled(loc: xLocator, options?: AssertionOptions): Promise<void> {
  const title = resolveTitle(`${displayName(loc)} is enabled`, options);
  await assertionStep(title, async () => {
    await currentExpect()(loc).toBeEnabled(matcherOptions(options));
  });
}

export async function assertDisabled(loc: xLocator, options?: AssertionOptions): Promise<void> {
  const title = resolveTitle(`${displayName(loc)} is disabled`, options);
  await assertionStep(title, async () => {
    await currentExpect()(loc).toBeDisabled(matcherOptions(options));
  });
}

export async function assertChecked(loc: xLocator, options?: AssertionOptions): Promise<void> {
  const title = resolveTitle(`${displayName(loc)} is checked`, options);
  await assertionStep(title, async () => {
    await currentExpect()(loc).toBeChecked(matcherOptions(options));
  });
}

export async function assertUnchecked(loc: xLocator, options?: AssertionOptions): Promise<void> {
  const title = resolveTitle(`${displayName(loc)} is unchecked`, options);
  await assertionStep(title, async () => {
    await currentExpect()(loc).not.toBeChecked(matcherOptions(options));
  });
}
