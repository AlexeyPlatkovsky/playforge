import type { xLocator } from "../../framework/core/xLocator";
import { xComponent } from "../../framework/core/xComponent";

export class ProductsCatalogComponent extends xComponent {
  readonly cards = this.$(".product-image-wrapper");
  readonly title = this.$("h2.title");

  cardByName(name: string): xLocator {
    return this.root.locator(".product-image-wrapper").filter({ hasText: name }).first() as xLocator;
  }

  productNameByName(name: string): xLocator {
    return this.cardByName(name).locator(".productinfo p").first() as xLocator;
  }

  viewProductLinkByName(name: string): xLocator {
    return this.cardByName(name).locator("a[href*='/product_details/']").first() as xLocator;
  }

  async openProductDetails(name: string): Promise<void> {
    await this.viewProductLinkByName(name).click();
  }
}
