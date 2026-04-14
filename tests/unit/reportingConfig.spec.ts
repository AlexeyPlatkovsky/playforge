import { expect, test } from "@playwright/test";

import config from "../../playwright.config";

test("playwright config keeps trace, screenshot, and video configured for failure triage @unit", () => {
  const use = config.use ?? {};

  expect(use.trace).toBe("retain-on-failure");
  expect(use.screenshot).toBe("only-on-failure");
  expect(use.video).toBe("retain-on-failure");
});

test("playwright config wires both allure-playwright and the HTML reporter @unit", () => {
  const reporters = Array.isArray(config.reporter) ? config.reporter : [];
  const names = reporters.map((entry) => (Array.isArray(entry) ? entry[0] : entry));

  expect(names).toEqual(expect.arrayContaining(["html", "allure-playwright", "list"]));
});
