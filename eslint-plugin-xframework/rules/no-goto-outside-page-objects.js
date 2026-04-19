"use strict";

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
        "Disallow calling page.goto outside of page objects. Navigation belongs to xPage.open()."
    },
    messages: {
      rawGoto:
        "`page.goto(...)` is only permitted inside page objects (pages/**). Construct the page and call `open()` instead."
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
        if (callee.property.type !== "Identifier" || callee.property.name !== "goto") {
          return;
        }
        if (!isPageIdentifier(callee.object) && !isThisPage(callee.object)) {
          return;
        }

        context.report({ node, messageId: "rawGoto" });
      }
    };
  }
};
