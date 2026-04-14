import { expect } from "@playwright/test";

import { BrandSidebarComponent } from "./components/BrandSidebarComponent";
import { ProductsCatalogComponent } from "./components/ProductsCatalogComponent";
import { SiteHeaderComponent } from "./components/SiteHeaderComponent";
import { SubscriptionFooterComponent } from "./components/SubscriptionFooterComponent";
import { xPage } from "../framework/core/xPage";

export class ProductsPage extends xPage {
  readonly brands = new BrandSidebarComponent(this.$(".brands_products"));
  readonly catalog = new ProductsCatalogComponent(this.$(".features_items"));
  readonly header = new SiteHeaderComponent(this.$("header"));
  readonly path = "/products";
  readonly searchButton = this.$("#submit_search");
  readonly searchInput = this.$("#search_product");
  readonly subscription = new SubscriptionFooterComponent(this.$("footer"));

  async isOpened(): Promise<void> {
    await expect(this.searchInput).toBeVisible();
    await expect(this.catalog.title).toHaveText("All Products");
    await expect(this.page).toHaveURL(/\/products(?:\?.*)?$/);
  }

  async searchProducts(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }

  async openBrand(name: string): Promise<void> {
    await this.brands.openBrand(name);
  }

  async openProductDetails(name: string): Promise<void> {
    await this.catalog.openProductDetails(name);
  }
}
