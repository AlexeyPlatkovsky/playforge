import { assertUrl } from "../../assertions";
import { expect, test } from "../../framework/fixtures/app.fixture";

import { DashboardPage } from "../../pages/DashboardPage";
import { LoginPage } from "../../pages/LoginPage";

test("login flow uses the component DSL and records named actions @ui", async ({
  logger,
  page
}) => {
  const loginPage = await new LoginPage(page).open();

  await loginPage.form.loginAs("demo-user", "demo-pass");

  const dashboardPage = new DashboardPage(page);
  await dashboardPage.isOpened();
  await assertUrl(page, /\/dashboard$/);

  expect(logger.history()).toEqual([
    "Fill on username (input[name='username'])",
    "Fill on password (input[name='password'])",
    "Click on submit (button[type='submit'])"
  ]);
});
