const js = require("@eslint/js");
const globals = require("globals");
const tseslint = require("typescript-eslint");
const xframework = require("./eslint-plugin-xframework");

module.exports = tseslint.config(
  {
    ignores: [
      "allure-report/**",
      "allure-results/**",
      "docs/plans/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**"
    ]
  },
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  {
    files: ["**/*.ts"],
    extends: [js.configs.recommended, ...tseslint.configs.strictTypeChecked],
    languageOptions: {
      globals: {
        ...globals.node
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname
      }
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error"
    }
  },
  {
    files: ["tests/**/*.ts", "playwright.config.ts"],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  {
    files: ["tests/ui/**/*.ts", "tests/unit/**/*.ts"],
    plugins: { xframework },
    rules: {
      "xframework/no-raw-locator-in-tests": "error",
      "xframework/no-goto-outside-page-objects": "error"
    }
  },
  {
    files: ["components/**/*.ts"],
    plugins: { xframework },
    rules: {
      "xframework/no-page-locator-in-components": "error"
    }
  },
  {
    files: ["pages/**/*.ts"],
    plugins: { xframework },
    rules: {
      "xframework/page-must-implement-is-opened": "error"
    }
  }
);
