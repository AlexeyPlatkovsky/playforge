import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

import {
  assertAttributeEquals,
  assertCount,
  assertEnabled,
  assertHidden,
  assertTextContains,
  assertTextEquals,
  assertVisible,
  currentMode,
  softGroup
} from "../../assertions";
import { wrapLocator, type xLocator } from "../../framework/core/xLocator";

const fixturePage = `<!doctype html>
<html>
  <body>
    <h1 id="title" data-kind="heading">Dashboard</h1>
    <p id="status">signed-in</p>
    <button id="primary" type="button">Go</button>
    <ul id="list">
      <li>one</li>
      <li>two</li>
      <li>three</li>
    </ul>
    <div id="hidden" style="display:none">secret</div>
  </body>
</html>`;

function wrap(page: Page, selector: string, name: string): xLocator {
  return wrapLocator(page.locator(selector), { name, selector });
}

test("assertion helpers resolve against the live DOM in hard mode @ui", async ({ page }) => {
  await page.setContent(fixturePage);

  await assertVisible(wrap(page, "#title", "title"));
  await assertTextEquals(wrap(page, "#title", "title"), "Dashboard");
  await assertTextContains(wrap(page, "#status", "status"), "signed");
  await assertAttributeEquals(wrap(page, "#title", "title"), "data-kind", "heading");
  await assertEnabled(wrap(page, "#primary", "primary"));
  await assertCount(wrap(page, "#list li", "items"), 3);
  await assertHidden(wrap(page, "#hidden", "hidden"));
});

test("hard assertion failure throws immediately @ui", async ({ page }) => {
  await page.setContent(fixturePage);

  await expect(async () => {
    await assertTextEquals(wrap(page, "#title", "title"), "Not Dashboard", {
      message: "hard failure",
      timeout: 200
    });
  }).rejects.toThrow();
});

test("softGroup keeps executing after a failing assertion @ui", async ({ page }) => {
  test.fail();
  await page.setContent(fixturePage);

  let executed = 0;
  const runOnce = async (fn: () => Promise<void>): Promise<void> => {
    await fn();
    executed += 1;
  };

  await softGroup("dashboard checks", async () => {
    await runOnce(() =>
      assertTextEquals(wrap(page, "#title", "title"), "Not Dashboard", {
        message: "soft-fail-1",
        timeout: 200
      })
    );
    await runOnce(() =>
      assertTextContains(wrap(page, "#status", "status"), "signed", {
        message: "soft-pass"
      })
    );
    await runOnce(() =>
      assertTextEquals(wrap(page, "#status", "status"), "pending", {
        message: "soft-fail-2",
        timeout: 200
      })
    );
  });

  expect(executed).toBe(3);
});

test("softGroup body receives soft mode and restores hard mode afterwards @ui", async ({
  page
}) => {
  await page.setContent(fixturePage);

  expect(currentMode()).toBe("hard");

  await softGroup("scoped group", async () => {
    expect(currentMode()).toBe("soft");
    await assertVisible(wrap(page, "#title", "title"));
  });

  expect(currentMode()).toBe("hard");
});
