# custom_playwright

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

## Architecture

The current project layout and the planned DSL layers are summarized in [docs/architecture/overview.md](./docs/architecture/overview.md).

## Authoring And Migration

- [Authoring with the DSL](./docs/guides/authoring-with-the-dsl.md)
- [Selenium author migration checklist](./docs/migration/selenium-authors-checklist.md)
- [Side-by-side migration examples](./docs/migration/custom-webelement-side-by-side.md)
- [Hardening and readiness notes](./docs/architecture/hardening-and-readiness.md)
