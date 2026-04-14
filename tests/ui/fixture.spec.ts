import { test, expect } from "../../framework/fixtures/app.fixture";
import { assertTextEquals, assertVisible } from "../../assertions";
import { wrapLocator } from "../../framework/core/xLocator";

const html = `<!doctype html>
<html>
  <body>
    <main>
      <h1 id="title">Mounted page</h1>
      <p id="msg">served from the worker-scoped fixture</p>
    </main>
  </body>
</html>`;

test("worker-scoped fixture server serves mounted HTML @ui", async ({ page, mountHtml }) => {
  const url = await mountHtml(html, "/mounted");
  await page.goto(url);

  const title = wrapLocator(page.locator("#title"), { name: "title", selector: "#title" });
  const msg = wrapLocator(page.locator("#msg"), { name: "msg", selector: "#msg" });

  await assertVisible(title);
  await assertTextEquals(title, "Mounted page");
  await assertTextEquals(msg, "served from the worker-scoped fixture");
});

test("logger fixture resets history between tests @ui", async ({ logger, mountHtml, page }) => {
  const url = await mountHtml("<button id='btn'>Hi</button>", "/btn");
  await page.goto(url);

  const button = wrapLocator(page.locator("#btn"), { name: "btn", selector: "#btn" });
  await button.click();

  expect(logger.history()).toEqual(["Click on btn (#btn)"]);
});
