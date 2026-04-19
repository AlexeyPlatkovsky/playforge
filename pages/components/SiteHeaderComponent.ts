import { xComponent } from "../../framework/core/xComponent";

export class SiteHeaderComponent extends xComponent {
  readonly cart = this.$("a[href='/view_cart']");
  readonly contactUs = this.$("a[href='/contact_us']");
  readonly home = this.$("a[href='/']");
  readonly products = this.$("a[href='/products']");
  readonly signupLogin = this.$("a[href='/login']");
  readonly testCases = this.$("a[href='/test_cases']");

  async openHome(): Promise<void> {
    await this.home.click();
  }

  async openProducts(): Promise<void> {
    await this.products.click();
  }
}
