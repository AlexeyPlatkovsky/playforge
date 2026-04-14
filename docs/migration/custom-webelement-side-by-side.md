# custom_webelement To TypeScript DSL

This document shows representative habit swaps between the older Java-style model and the TypeScript Playwright DSL used in this repo.

## Page Objects Stay Pages

Representative Java original:

```java
public class DashboardPage extends BasePage {
    @FindBy(css = "[data-testid='user-search']")
    private WebElement searchInput;

    public void searchUsers(String value) {
        searchInput.sendKeys(value);
    }
}
```

TypeScript DSL:

```ts
export class DashboardPage extends xPage {
  readonly path = "/dashboard";
  readonly searchInput = this.$("[data-testid='user-search']");

  async searchUsers(term: string): Promise<void> {
    await this.searchInput.fill(term);
  }
}
```

See the real implementation in `pages/DashboardPage.ts`.

## Reusable Regions Become Components

Representative Java original:

```java
public class UsersTable extends CustomWebElement {
    public WebElement rowByName(String name) {
        return root.$x(".//tr[td[normalize-space()='" + name + "']]");
    }
}
```

TypeScript DSL:

```ts
export class UsersTableComponent extends xComponent {
  readonly rows = this.$("tbody tr");

  rowByName(name: string): xLocator {
    return this.rows.filter({ hasText: name }).first() as xLocator;
  }
}
```

See the real implementation in `components/UsersTableComponent.ts`.

## Specs Read Like Flows, Not Selector Scripts

Representative Java original:

```java
dashboardPage.searchUsers("Grace");
assertEquals(usersTable.rowByName("Grace").status().getText(), "Pending");
```

TypeScript DSL:

```ts
await dashboardPage.searchUsers("Grace");
await assertTextEquals(dashboardPage.usersTable.statusByName("Grace Hopper"), "Pending");
```

See the real flows in `tests/ui/dashboard.spec.ts`.

## Assertion Batches Use `softGroup`

Representative Java original:

```java
softly.assertThat(details.name()).isEqualTo("Grace Hopper");
softly.assertThat(details.role()).isEqualTo("Admin");
softly.assertAll();
```

TypeScript DSL:

```ts
await softGroup("selected user details", async () => {
  await assertTextEquals(dashboardPage.detailsName, "Grace Hopper");
  await assertTextEquals(dashboardPage.detailsRole, "Admin");
});
```

This keeps the browser assertion style aligned with the rest of the helper layer while preserving grouped failure reporting.
