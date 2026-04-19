import {
  assertCount,
  assertTextContains,
  assertTextEquals,
  assertUrl,
  assertVisible,
  softGroup
} from "../../assertions";
import { test } from "../../framework/fixtures/app.fixture";
import { ProductDetailsPage } from "../../pages/ProductDetailsPage";
import { ProductsPage } from "../../pages/ProductsPage";

test("products search narrows the catalog on automationexercise @ui", async ({ page }) => {
  const productsPage = await new ProductsPage(page).open();

  await productsPage.searchProducts("Blue Top");

  await assertUrl(page, /\/products\?search=Blue%20Top$/);
  await assertTextEquals(productsPage.catalog.title, "Searched Products");
  await assertCount(productsPage.catalog.cards, 1);
  await assertTextEquals(productsPage.catalog.productNameByName("Blue Top"), "Blue Top");
});

test("brand filter uses the sidebar component and shows Polo products @ui", async ({ page }) => {
  const productsPage = await new ProductsPage(page).open();

  await productsPage.openBrand("Polo");

  await assertUrl(page, /\/brand_products\/Polo$/);
  await assertTextEquals(productsPage.catalog.title, "Brand - Polo Products");
  await assertVisible(productsPage.catalog.cardByName("Premium Polo T-Shirts"));
  await assertVisible(productsPage.catalog.cardByName("Blue Top"));
});

test("product details page exposes structured product information @ui", async ({ page }) => {
  const productsPage = await new ProductsPage(page).open();

  await productsPage.openProductDetails("Blue Top");

  const productDetailsPage = new ProductDetailsPage(page, 1);
  await productDetailsPage.isOpened();

  await softGroup("blue top details", async () => {
    await assertTextEquals(productDetailsPage.information.name, "Blue Top");
    await assertTextContains(productDetailsPage.information.category, "Women > Tops");
    await assertTextContains(productDetailsPage.information.price, "Rs. 500");
    await assertTextContains(productDetailsPage.information.availability, "In Stock");
    await assertTextContains(productDetailsPage.information.condition, "New");
    await assertTextContains(productDetailsPage.information.brand, "Polo");
  });
});

test("subscription footer confirms a successful subscription on the live site @ui", async ({
  page
}) => {
  const productsPage = await new ProductsPage(page).open();

  await productsPage.subscription.subscribeAs("codex.automation.exercise@example.com");

  await assertVisible(productsPage.subscription.successMessage);
  await assertTextContains(
    productsPage.subscription.successMessage,
    "You have been successfully subscribed!"
  );
});
