import { type AssertionOptions, assertionStep, displayName, matcherOptions, resolveTitle } from "./_step";
import { currentExpect } from "./soft";
import type { xLocator } from "../framework/core/xLocator";

export async function assertAttributeEquals(
  loc: xLocator,
  attribute: string,
  expected: string,
  options?: AssertionOptions
): Promise<void> {
  const title = resolveTitle(`${displayName(loc)} [${attribute}] equals "${expected}"`, options);
  await assertionStep(title, async () => {
    await currentExpect()(loc).toHaveAttribute(attribute, expected, matcherOptions(options));
  });
}

export async function assertAttributePresent(
  loc: xLocator,
  attribute: string,
  options?: AssertionOptions
): Promise<void> {
  const title = resolveTitle(`${displayName(loc)} has attribute [${attribute}]`, options);
  await assertionStep(title, async () => {
    await currentExpect()(loc).toHaveAttribute(attribute, /.*/, matcherOptions(options));
  });
}
