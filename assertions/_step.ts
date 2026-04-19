import { test } from "@playwright/test";

import type { xLocator } from "../framework/core/xLocator";

export interface AssertionOptions {
  message?: string;
  timeout?: number;
}

export function displayName(loc: xLocator): string {
  return loc.__meta.name ?? loc.__meta.selector;
}

export async function assertionStep(title: string, body: () => Promise<void>): Promise<void> {
  await test.step(title, body);
}

export function resolveTitle(fallback: string, options: AssertionOptions | undefined): string {
  return options?.message ?? fallback;
}

export function matcherOptions(
  options: AssertionOptions | undefined
): { timeout?: number } | undefined {
  if (options?.timeout === undefined) {
    return undefined;
  }
  return { timeout: options.timeout };
}
