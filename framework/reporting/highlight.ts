import type { Locator } from "@playwright/test";

import { env } from "../config/env";

export async function highlightLocator(locator: Locator): Promise<void> {
  if (!env.HIGHLIGHT) {
    return;
  }

  try {
    await locator.first().evaluate((node: Element) => {
      const element = node as HTMLElement;
      const previous = element.style.outline;
      element.style.outline = "2px solid rgba(227, 80, 80, 0.9)";
      element.style.outlineOffset = "1px";
      setTimeout(() => {
        element.style.outline = previous;
      }, 400);
    });
  } catch {
    // Highlight is best-effort; never fail a step because of it.
  }
}
