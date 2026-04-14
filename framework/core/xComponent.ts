import { isXLocator, rawLocator, type xLocator, wrapLocator } from "./xLocator";

export abstract class xComponent {
  constructor(public readonly root: xLocator) {
    queueMicrotask(() => {
      this.bindNames();
    });
  }

  protected $(selector: string): xLocator {
    return wrapLocator(rawLocator(this.root).locator(selector), {
      parent: this.root.__meta,
      selector
    });
  }

  private bindNames(): void {
    for (const [key, value] of Object.entries(this)) {
      if (key === "root") {
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
