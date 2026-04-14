import {
  assertCount,
  assertHidden,
  assertTextContains,
  assertTextEquals,
  assertVisible,
  softGroup
} from "../../assertions";
import { test } from "../../framework/fixtures/app.fixture";
import { DashboardPage } from "../../pages/DashboardPage";

test("dashboard search narrows the reusable users table component @ui", async ({ page }) => {
  const dashboardPage = await new DashboardPage(page).open();

  await dashboardPage.searchUsers("Grace");

  await assertTextEquals(dashboardPage.filterSummary, "Showing all roles");
  await assertTextEquals(dashboardPage.visibleUserCount, "1 visible users");
  await assertCount(dashboardPage.usersTable.rows, 1);
  await assertTextEquals(dashboardPage.usersTable.roleByName("Grace Hopper"), "Admin");
  await assertTextEquals(dashboardPage.usersTable.statusByName("Grace Hopper"), "Pending");
});

test("dashboard admin filter keeps only admin rows visible @ui", async ({ page }) => {
  const dashboardPage = await new DashboardPage(page).open();

  await dashboardPage.enableAdminsOnly();

  await assertTextEquals(dashboardPage.filterSummary, "Showing admin users only");
  await assertTextEquals(dashboardPage.visibleUserCount, "2 visible users");
  await assertCount(dashboardPage.usersTable.rows, 2);
  await assertTextEquals(dashboardPage.usersTable.statusByName("Ada Lovelace"), "Active");
  await assertTextEquals(dashboardPage.usersTable.statusByName("Grace Hopper"), "Pending");
});

test("dashboard details view reads naturally through the page and component APIs @ui", async ({
  page
}) => {
  const dashboardPage = await new DashboardPage(page).open();

  await dashboardPage.openUserDetails("Grace Hopper");

  await assertVisible(dashboardPage.detailsPanel);
  await softGroup("selected user details", async () => {
    await assertTextEquals(dashboardPage.detailsName, "Grace Hopper");
    await assertTextEquals(dashboardPage.detailsEmail, "grace@example.com");
    await assertTextEquals(dashboardPage.detailsRole, "Admin");
    await assertTextEquals(dashboardPage.detailsStatus, "Pending");
  });
});

test("dashboard invite flow adds a pending analyst without raw locators in the spec @ui", async ({
  page
}) => {
  const dashboardPage = await new DashboardPage(page).open();

  await dashboardPage.inviteUser("Barbara Liskov", "barbara@example.com", "Analyst");

  await assertVisible(dashboardPage.inviteToast);
  await assertTextContains(dashboardPage.inviteToast, "Barbara Liskov");
  await assertTextEquals(dashboardPage.visibleUserCount, "6 visible users");
  await assertTextEquals(dashboardPage.usersTable.roleByName("Barbara Liskov"), "Analyst");
  await assertTextEquals(dashboardPage.usersTable.statusByName("Barbara Liskov"), "Pending");
});

test("dashboard empty state appears when filters eliminate every row @ui", async ({ page }) => {
  const dashboardPage = await new DashboardPage(page).open();

  await dashboardPage.searchUsers("no matching user");

  await assertTextEquals(dashboardPage.visibleUserCount, "0 visible users");
  await assertCount(dashboardPage.usersTable.rows, 0);
  await assertVisible(dashboardPage.usersTable.emptyState);
  await assertHidden(dashboardPage.detailsPanel);
});
