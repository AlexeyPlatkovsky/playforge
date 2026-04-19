import type { xLocator } from "../../framework/core/xLocator";
import { xComponent } from "../../framework/core/xComponent";

export class SubscriptionFooterComponent extends xComponent {
  readonly email = this.root.getByPlaceholder("Your email address") as xLocator;
  readonly submit = this.$("#subscribe");
  readonly successMessage = this.root
    .getByText("You have been successfully subscribed!")
    .first() as xLocator;

  async subscribeAs(email: string): Promise<void> {
    await this.email.fill(email);
    await this.submit.click();
  }
}
