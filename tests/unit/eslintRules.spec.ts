import { test } from "@playwright/test";
import { RuleTester } from "eslint";

import type { Rule } from "eslint";

import xframework from "../../eslint-plugin-xframework/index.js";

const rules = xframework.rules;

function mustGet(name: string): Rule.RuleModule {
  const rule = rules[name];
  if (!rule) {
    throw new Error(`rule ${name} is not registered on the plugin`);
  }
  return rule;
}

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    parserOptions: { ecmaVersion: 2022, sourceType: "module" },
    sourceType: "module"
  }
});

test("no-raw-locator-in-tests flags page.locator/getByRole on Page identifiers @unit", () => {
  tester.run("no-raw-locator-in-tests", mustGet("no-raw-locator-in-tests"), {
    valid: [
      { code: "loginPage.form.submit.click();" },
      { code: "await component.$('input').click();" }
    ],
    invalid: [
      {
        code: "page.locator('#foo').click();",
        errors: [{ messageId: "rawLocator", data: { method: "locator" } }]
      },
      {
        code: "page.getByRole('button').click();",
        errors: [{ messageId: "rawLocator", data: { method: "getByRole" } }]
      },
      {
        code: "this.page.getByTestId('x').fill('v');",
        errors: [{ messageId: "rawLocator", data: { method: "getByTestId" } }]
      }
    ]
  });
});

test("no-goto-outside-page-objects flags page.goto and this.page.goto @unit", () => {
  tester.run(
    "no-goto-outside-page-objects",
    mustGet("no-goto-outside-page-objects"),
    {
      valid: [{ code: "await loginPage.open();" }],
      invalid: [
        { code: "await page.goto('/');", errors: [{ messageId: "rawGoto" }] },
        { code: "await this.page.goto(url);", errors: [{ messageId: "rawGoto" }] }
      ]
    }
  );
});

test("no-page-locator-in-components flags locator and goto @unit", () => {
  tester.run(
    "no-page-locator-in-components",
    mustGet("no-page-locator-in-components"),
    {
      valid: [
        { code: "this.$('selector').click();" },
        { code: "this.root.locator('child');" }
      ],
      invalid: [
        {
          code: "page.locator('#x');",
          errors: [{ messageId: "pageInComponent", data: { method: "locator" } }]
        },
        {
          code: "this.page.goto('/');",
          errors: [{ messageId: "pageInComponent", data: { method: "goto" } }]
        }
      ]
    }
  );
});

test("page-must-implement-is-opened flags classes that extend xPage without isOpened @unit", () => {
  tester.run(
    "page-must-implement-is-opened",
    mustGet("page-must-implement-is-opened"),
    {
      valid: [
        {
          code: "class Good extends xPage { isOpened() {} }"
        },
        {
          code: "class Unrelated extends Object {}"
        }
      ],
      invalid: [
        {
          code: "class Bad extends xPage { path = '/'; }",
          errors: [{ messageId: "missingIsOpened", data: { name: "Bad" } }]
        }
      ]
    }
  );
});
