"use strict";

const noRawLocatorInTests = require("./rules/no-raw-locator-in-tests");
const noGotoOutsidePageObjects = require("./rules/no-goto-outside-page-objects");
const noPageLocatorInComponents = require("./rules/no-page-locator-in-components");
const pageMustImplementIsOpened = require("./rules/page-must-implement-is-opened");

const plugin = {
  meta: {
    name: "eslint-plugin-xframework",
    version: "0.1.0"
  },
  rules: {
    "no-raw-locator-in-tests": noRawLocatorInTests,
    "no-goto-outside-page-objects": noGotoOutsidePageObjects,
    "no-page-locator-in-components": noPageLocatorInComponents,
    "page-must-implement-is-opened": pageMustImplementIsOpened
  }
};

plugin.configs = {
  recommended: {
    plugins: { xframework: plugin },
    rules: {}
  }
};

module.exports = plugin;
