import { expect, test } from "@playwright/test";

import { xPage } from "../../framework/core/xPage";
import { createFakePage, type RecordedCall } from "./helpers/fakes";
import { isXLocator } from "../../framework/core/xLocator";

class DemoPage extends xPage {
  readonly path = "/login";
  readonly submit = this.$("#submit");

  opened = false;

  isOpened(): Promise<void> {
    this.opened = true;
    return Promise.resolve();
  }
}

test("xPage navigates with base url and exposes wrapped page locators @unit", async () => {
  const calls: RecordedCall[] = [];
  const { page, state } = createFakePage(calls);
  const demo = new DemoPage(page);

  await demo.open();

  expect(state.navigatedTo).toBe("http://127.0.0.1:3407/login");
  expect(demo.opened).toBe(true);
  expect(isXLocator(demo.submit)).toBe(true);
  expect(demo.submit.__meta.selector).toBe("#submit");
  expect(calls).toEqual([
    { args: ["#submit"], method: "locator", target: "page" },
    { args: ["http://127.0.0.1:3407/login"], method: "goto", target: "page" }
  ]);
});
