import { expect } from "@playwright/test";

import { UsersTableComponent } from "../components/UsersTableComponent";
import { xPage } from "../framework/core/xPage";

export class DashboardPage extends xPage {
  readonly adminOnly = this.$("[data-testid='admin-only']");
  readonly detailsEmail = this.$("[data-testid='details-email']");
  readonly detailsName = this.$("[data-testid='details-name']");
  readonly detailsPanel = this.$("[data-testid='user-details']");
  readonly detailsRole = this.$("[data-testid='details-role']");
  readonly detailsStatus = this.$("[data-testid='details-status']");
  readonly filterSummary = this.$("[data-testid='filter-summary']");
  readonly heading = this.$("[data-testid='dashboard-title']");
  readonly inviteButton = this.$("[data-testid='invite-user']");
  readonly inviteDialog = this.$("[data-testid='invite-dialog']");
  readonly inviteEmail = this.$("[data-testid='invite-email']");
  readonly inviteName = this.$("[data-testid='invite-name']");
  readonly inviteRole = this.$("[data-testid='invite-role']");
  readonly inviteSave = this.$("[data-testid='invite-save']");
  readonly inviteToast = this.$("[data-testid='invite-toast']");
  readonly path = "/dashboard";
  readonly searchInput = this.$("[data-testid='user-search']");
  readonly usersTable = new UsersTableComponent(this.$("[data-testid='users-table']"));
  readonly visibleUserCount = this.$("[data-testid='visible-user-count']");

  async isOpened(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.page).toHaveURL(/\/dashboard$/);
  }

  async searchUsers(term: string): Promise<void> {
    await this.searchInput.fill(term);
  }

  async enableAdminsOnly(): Promise<void> {
    await this.adminOnly.check();
  }

  async disableAdminsOnly(): Promise<void> {
    await this.adminOnly.uncheck();
  }

  async openUserDetails(name: string): Promise<void> {
    await this.usersTable.openDetails(name);
  }

  async inviteUser(name: string, email: string, role: string): Promise<void> {
    await this.inviteButton.click();
    await this.inviteName.fill(name);
    await this.inviteEmail.fill(email);
    await this.inviteRole.selectOption(role);
    await this.inviteSave.click();
  }
}
