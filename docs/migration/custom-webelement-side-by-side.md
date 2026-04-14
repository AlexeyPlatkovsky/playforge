# custom_webelement To TypeScript DSL

This document shows representative habit swaps between the older Java-style model and the TypeScript Playwright DSL used in this repo.

## Page Objects Stay Pages

Representative Java original:

```java
public class ProductsPage extends BasePage {
    @FindBy(id = "search_product")
    private WebElement searchInput;

    public void searchProducts(String value) {
        searchInput.sendKeys(value);
    }
}
```

TypeScript DSL:

```ts
export class ProductsPage extends xPage {
  readonly path = "/products";
  readonly searchInput = this.$("#search_product");

  async searchProducts(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }
}
```

See the real implementation in `pages/ProductsPage.ts`.

## Reusable Regions Become Components

Representative Java original:

```java
public class ProductsCatalog extends CustomWebElement {
    public WebElement cardByName(String name) {
        return root.$x(".//div[contains(@class,'product-image-wrapper')][contains(.,'" + name + "')]");
    }
}
```

TypeScript DSL:

```ts
export class ProductsCatalogComponent extends xComponent {
  readonly cards = this.$(".product-image-wrapper");

  cardByName(name: string): xLocator {
    return this.root.locator(".product-image-wrapper").filter({ hasText: name }).first() as xLocator;
  }
}
```

See the real implementation in `pages/components/ProductsCatalogComponent.ts`.

## Specs Read Like Flows, Not Selector Scripts

Representative Java original:

```java
productsPage.searchProducts("Blue Top");
assertEquals(productsCatalog.cardByName("Blue Top").getText(), "Blue Top");
```

TypeScript DSL:

```ts
await productsPage.searchProducts("Blue Top");
await assertTextEquals(productsPage.catalog.productNameByName("Blue Top"), "Blue Top");
```

See the real flows in `tests/ui/products.spec.ts`.

## Assertion Batches Use `softGroup`

Representative Java original:

```java
softly.assertThat(product.name()).isEqualTo("Blue Top");
softly.assertThat(product.brand()).contains("Polo");
softly.assertAll();
```

TypeScript DSL:

```ts
await softGroup("blue top details", async () => {
  await assertTextEquals(productDetailsPage.information.name, "Blue Top");
  await assertTextContains(productDetailsPage.information.brand, "Polo");
});
```

This keeps the browser assertion style aligned with the rest of the helper layer while preserving grouped failure reporting.
