import { expect, type Page } from "@playwright/test";

import { ProductInformationComponent } from "./components/ProductInformationComponent";
import { SiteHeaderComponent } from "./components/SiteHeaderComponent";
import { SubscriptionFooterComponent } from "./components/SubscriptionFooterComponent";
import { xPage } from "../framework/core/xPage";

export class ProductDetailsPage extends xPage {
  readonly header = new SiteHeaderComponent(this.$("header"));
  readonly information = new ProductInformationComponent(this.$(".product-information"));
  readonly path: string;
  readonly productHero = this.$(".view-product img");
  readonly subscription = new SubscriptionFooterComponent(this.$("footer"));

  constructor(page: Page, readonly productId: number) {
    super(page);
    this.path = `/product_details/${String(this.productId)}`;
  }

  async isOpened(): Promise<void> {
    await expect(this.productHero).toBeVisible();
    await expect(this.information.name).toBeVisible();
    await expect(this.page).toHaveURL(new RegExp(`/product_details/${String(this.productId)}$`));
  }
}
