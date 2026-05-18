import type { Page } from "@playwright/test";

import { env } from "../config/env";
import { xComponent } from "./xComponent";
import { isXLocator, type xLocator, wrapLocator } from "./xLocator";

const consentHandlerPages = new WeakSet<Page>();

export abstract class xPage {
  constructor(protected readonly page: Page) {
    queueMicrotask(() => {
      this.bindNames();
    });
  }

  abstract readonly path: string;

  async open(): Promise<this> {
    await this.installConsentDialogHandler();
    await this.page.goto(new URL(this.path, env.BASE_URL).toString());
    await this.isOpened();
    return this;
  }

  abstract isOpened(): Promise<void>;

  protected $(selector: string): xLocator {
    return wrapLocator(this.page.locator(selector), { selector });
  }

  private async installConsentDialogHandler(): Promise<void> {
    if (consentHandlerPages.has(this.page)) {
      return;
    }

    consentHandlerPages.add(this.page);
    await this.page.addLocatorHandler(
      this.page.getByRole("dialog", { name: /This site asks for consent/i }),
      async (dialog) => {
        await dialog.getByRole("button", { name: "Consent" }).click();
      },
      { times: 1 }
    );
  }

  private bindNames(): void {
    for (const [key, value] of Object.entries(this)) {
      if (key === "page") {
        continue;
      }

      if (isXLocator(value) && value.__meta.name === undefined) {
        value.__meta.name = key;
      }

      if (value instanceof xComponent && value.root.__meta.name === undefined) {
        value.root.__meta.name = key;
      }
    }
  }
}
