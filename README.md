# playforge

Strict TypeScript + Playwright foundation for a Component-DSL testing framework.

## Requirements

- Node `22` via [`.nvmrc`](./.nvmrc)
- npm

## Bootstrap

```bash
nvm use
npm install
npx playwright install --with-deps chromium
```

`BASE_URL` defaults to `https://automationexercise.com`. Override it only when you need to point the DSL at a different environment.

## Scripts

```bash
npm run typecheck
npm run lint
npm run test:unit
npm run test:ui
npm run test
npm run report:html
npm run report:allure
```

The browser suites target `https://automationexercise.com` by default and do not start a local demo site.

## Configuration

Environment parsing lives in [`framework/config`](./framework/config). Required and optional variables are documented in [`.env.example`](./.env.example).

## CI

GitHub Actions runs on code-oriented changes under the framework, pages, tests, package manifests, and related config files. The workflow keeps unit and UI suites separate, uploads Playwright and Allure artifacts for each suite, and posts a short PR summary table with result, execution time, and report links.

## Architecture

The current project layout and the planned DSL layers are summarized in [docs/architecture/overview.md](./docs/architecture/overview.md).

## Authoring And Migration

- [Authoring with the DSL](./docs/guides/authoring-with-the-dsl.md)
