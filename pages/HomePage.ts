import { expect } from "@playwright/test";

import { ProductsCatalogComponent } from "./components/ProductsCatalogComponent";
import { SiteHeaderComponent } from "./components/SiteHeaderComponent";
import { SubscriptionFooterComponent } from "./components/SubscriptionFooterComponent";
import { xPage } from "../framework/core/xPage";

export class HomePage extends xPage {
  readonly featuredProducts = new ProductsCatalogComponent(this.$(".features_items"));
  readonly header = new SiteHeaderComponent(this.$("header"));
  readonly heroHeading = this.$(".carousel-inner .item.active h1");
  readonly path = "/";
  readonly subscription = new SubscriptionFooterComponent(this.$("footer"));

  async isOpened(): Promise<void> {
    await expect(this.heroHeading).toBeVisible();
    await expect(this.page).toHaveURL(/automationexercise\.com\/?$/);
  }
}
