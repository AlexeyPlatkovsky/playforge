import { expect, test } from "@playwright/test";

import { DashboardPage } from "../../pages/DashboardPage";
import { LoginPage } from "../../pages/LoginPage";
import { xLogger } from "../../framework/core/xLogger";

test.beforeEach(() => {
  xLogger.resetForTesting();
});

test("login flow uses the component DSL and records named actions @ui", async ({ page }) => {
  const loginPage = await new LoginPage(page).open();

  await loginPage.form.loginAs("demo-user", "demo-pass");

  const dashboardPage = new DashboardPage(page);
  await dashboardPage.isOpened();

  expect(xLogger.history()).toEqual([
    "Fill on username (input[name='username'])",
    "Fill on password (input[name='password'])",
    "Click on submit (button[type='submit'])"
  ]);
});
