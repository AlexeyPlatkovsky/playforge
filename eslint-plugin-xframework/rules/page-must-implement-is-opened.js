"use strict";

function extendsXPage(node) {
  const superClass = node.superClass;
  if (!superClass) {
    return false;
  }
  if (superClass.type === "Identifier" && superClass.name === "xPage") {
    return true;
  }
  return false;
}

function hasIsOpenedMethod(body) {
  return body.body.some((member) => {
    if (member.type !== "MethodDefinition") {
      return false;
    }
    const key = member.key;
    if (member.computed) {
      return false;
    }
    return key.type === "Identifier" && key.name === "isOpened";
  });
}

function isAbstractClass(node) {
  return Boolean(node.abstract);
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Every concrete class extending xPage must implement isOpened() so open() has a readiness gate."
    },
    messages: {
      missingIsOpened:
        "Class `{{name}}` extends xPage but does not implement `isOpened()`. Add an `isOpened()` method or mark the class abstract."
    },
    schema: []
  },
  create(context) {
    function check(node) {
      if (!extendsXPage(node) || isAbstractClass(node)) {
        return;
      }
      if (hasIsOpenedMethod(node.body)) {
        return;
      }

      const name = node.id?.name ?? "<anonymous>";
      context.report({
        node: node.id ?? node,
        messageId: "missingIsOpened",
        data: { name }
      });
    }

    return {
      ClassDeclaration: check,
      ClassExpression: check
    };
  }
};
