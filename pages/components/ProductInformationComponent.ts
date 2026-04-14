import type { xLocator } from "../../framework/core/xLocator";
import { xComponent } from "../../framework/core/xComponent";

export class ProductInformationComponent extends xComponent {
  readonly availability = this.root.locator("p").filter({ hasText: "Availability:" }).first() as xLocator;
  readonly brand = this.root.locator("p").filter({ hasText: "Brand:" }).first() as xLocator;
  readonly category = this.root.locator("p").filter({ hasText: "Category:" }).first() as xLocator;
  readonly condition = this.root.locator("p").filter({ hasText: "Condition:" }).first() as xLocator;
  readonly name = this.$("h2");
  readonly price = this.$("span > span");
  readonly quantity = this.$("#quantity");
}
