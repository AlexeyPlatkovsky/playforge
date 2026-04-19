import type { xLocator } from "../../framework/core/xLocator";
import { xComponent } from "../../framework/core/xComponent";

export class BrandSidebarComponent extends xComponent {
  readonly heading = this.root.getByText("Brands").first() as xLocator;

  brandLink(name: string): xLocator {
    return this.root.locator("a").filter({ hasText: name }).first() as xLocator;
  }

  async openBrand(name: string): Promise<void> {
    await this.brandLink(name).click();
  }
}
