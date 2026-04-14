"use strict";

const RAW_LOCATOR_METHODS = new Set([
  "locator",
  "getByRole",
  "getByTestId",
  "getByText",
  "getByLabel",
  "getByPlaceholder",
  "getByTitle",
  "getByAltText"
]);

function isPageIdentifier(node) {
  return node.type === "Identifier" && node.name === "page";
}

function isThisPage(node) {
  return (
    node.type === "MemberExpression" &&
    !node.computed &&
    node.object.type === "ThisExpression" &&
    node.property.type === "Identifier" &&
    node.property.name === "page"
  );
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow calling raw Playwright locator APIs on a Page in test files. Tests must go through page or component objects."
    },
    messages: {
      rawLocator:
        "Raw Playwright selector `page.{{method}}(...)` is not allowed in test files. Add a method or field to the appropriate page/component and call that instead."
    },
    schema: []
  },
  create(context) {
    return {
      CallExpression(node) {
        const callee = node.callee;
        if (callee.type !== "MemberExpression" || callee.computed) {
          return;
        }
        if (callee.property.type !== "Identifier") {
          return;
        }
        if (!RAW_LOCATOR_METHODS.has(callee.property.name)) {
          return;
        }
        if (!isPageIdentifier(callee.object) && !isThisPage(callee.object)) {
          return;
        }

        context.report({
          node,
          messageId: "rawLocator",
          data: { method: callee.property.name }
        });
      }
    };
  }
};
