"use strict";

const PAGE_ONLY_METHODS = new Set([
  "locator",
  "getByRole",
  "getByTestId",
  "getByText",
  "getByLabel",
  "getByPlaceholder",
  "getByTitle",
  "getByAltText",
  "goto"
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
        "Disallow accessing page.locator or page.goto from inside xComponent subclasses. Components must use `this.$(selector)` through their scoped root."
    },
    messages: {
      pageInComponent:
        "Components must not call `page.{{method}}(...)`. Use `this.$('selector')` through the scoped root locator instead."
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
        if (!PAGE_ONLY_METHODS.has(callee.property.name)) {
          return;
        }
        if (!isPageIdentifier(callee.object) && !isThisPage(callee.object)) {
          return;
        }

        context.report({
          node,
          messageId: "pageInComponent",
          data: { method: callee.property.name }
        });
      }
    };
  }
};
