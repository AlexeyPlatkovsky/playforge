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

If you are not using the provided npm scripts, set `BASE_URL` before running Playwright because config validation is fail-fast.

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

The test scripts pin `BASE_URL=http://127.0.0.1:3407` and start a tiny local smoke app through Playwright's `webServer` hook.

## Configuration

Environment parsing lives in [`framework/config`](./framework/config). Required and optional variables are documented in [`.env.example`](./.env.example).

## Architecture

The current project layout and the planned DSL layers are summarized in [docs/architecture/overview.md](./docs/architecture/overview.md).

## Authoring And Migration

- [Authoring with the DSL](./docs/guides/authoring-with-the-dsl.md)
- [Selenium author migration checklist](./docs/migration/selenium-authors-checklist.md)
- [Side-by-side migration examples](./docs/migration/custom-webelement-side-by-side.md)
- [Hardening and readiness notes](./docs/architecture/hardening-and-readiness.md)
