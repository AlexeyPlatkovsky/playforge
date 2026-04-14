import { assertTextEquals, assertUrl, assertVisible } from "../../assertions";
import { test } from "../../framework/fixtures/app.fixture";
import { HomePage } from "../../pages/HomePage";
import { ProductsPage } from "../../pages/ProductsPage";

test("home page opens the live automationexercise site and navigates to products @ui", async ({
  page
}) => {
  const homePage = await new HomePage(page).open();

  await assertVisible(homePage.heroHeading);
  await assertTextEquals(homePage.featuredProducts.productNameByName("Blue Top"), "Blue Top");

  await homePage.header.openProducts();

  const productsPage = new ProductsPage(page);
  await productsPage.isOpened();
  await assertUrl(page, /\/products$/);
});
