import { expect } from "@playwright/test";

import { LoginFormComponent } from "../components/LoginFormComponent";
import { xPage } from "../framework/core/xPage";

export class LoginPage extends xPage {
  readonly form = new LoginFormComponent(this.$("[data-testid='login-form']"));
  readonly path = "/login";

  async isOpened(): Promise<void> {
    await expect(this.form.root).toBeVisible();
  }
}
