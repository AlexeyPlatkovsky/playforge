import type { xLocator } from "../framework/core/xLocator";
import { xComponent } from "../framework/core/xComponent";

export class UsersTableComponent extends xComponent {
  readonly emptyState = this.$("[data-testid='users-empty']");
  readonly rows = this.$("tbody tr");

  rowByName(name: string): xLocator {
    return this.root.locator(`tbody tr[data-user-name="${name}"]`).first() as xLocator;
  }

  roleByName(name: string): xLocator {
    return this.rowByName(name).locator("[data-col='role']") as xLocator;
  }

  statusByName(name: string): xLocator {
    return this.rowByName(name).locator("[data-col='status']") as xLocator;
  }

  private viewButtonByName(name: string): xLocator {
    return this.rowByName(name).locator("[data-testid='view-user']") as xLocator;
  }

  async openDetails(name: string): Promise<void> {
    await this.viewButtonByName(name).click();
  }
}
