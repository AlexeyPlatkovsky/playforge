import { expect, test } from "@playwright/test";

import { createFakeLocator, type RecordedCall } from "./helpers/fakes";
import { isXLocator, type xLocator, wrapLocator } from "../../framework/core/xLocator";
import { xLogger } from "../../framework/core/xLogger";

test.beforeEach(() => {
  xLogger.resetForTesting();
});

test("wrapLocator logs click actions with bound metadata @unit", async () => {
  const calls: RecordedCall[] = [];
  const messages: string[] = [];

  xLogger.setSinksForTesting([(message) => {
    messages.push(message);
  }]);

  const submit = wrapLocator(createFakeLocator("#submit", calls), {
    name: "submit",
    selector: "#submit"
  });

  await submit.click();

  expect(calls).toEqual([{ args: [], method: "click", target: "#submit" }]);
  expect(messages).toContain("Click on submit (#submit)");
  expect(xLogger.history()).toContain("Click on submit (#submit)");
});

test("wrapLocator re-wraps chained locators and keeps lineage metadata @unit", () => {
  const calls: RecordedCall[] = [];

  const rows = wrapLocator(createFakeLocator("#users", calls), {
    name: "rows",
    selector: "#users"
  });

  const thirdRow = rows.locator("tbody tr").nth(2) as xLocator;

  expect(isXLocator(thirdRow)).toBe(true);
  expect(thirdRow.__meta.selector).toBe("#users >> locator(tbody tr) >> nth(2)");
  expect(thirdRow.__meta.name).toBe("rows.locator(tbody tr).nth(2)");
  expect(calls).toEqual([
    { args: ["tbody tr"], method: "locator", target: "#users" },
    { args: [2], method: "nth", target: "#users >> tbody tr" }
  ]);
});
