import { expect } from "@playwright/test";

import { xPage } from "../framework/core/xPage";

export class DashboardPage extends xPage {
  readonly heading = this.$("[data-testid='dashboard-title']");
  readonly path = "/dashboard";

  async isOpened(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.page).toHaveURL(/\/dashboard$/);
  }
}
