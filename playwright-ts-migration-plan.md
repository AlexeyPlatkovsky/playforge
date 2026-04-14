# Playwright + TypeScript Migration Plan

Target: a TS framework equivalent in spirit (not shape) to `custom_webelement`, built as a **Component-DSL** on top of `@playwright/test`. This plan is the output of a structured design discussion; every choice below was decided explicitly, not defaulted.

---

## 0. Design decisions locked in discussion

| # | Decision |
|---|---|
| Q1 | **Direction:** Component-DSL framework (not a thin conventions layer, not a faithful Selenium port). |
| Q2 | **Page ≠ Component.** Page is a plain class holding a Playwright `Page`. Component is the only scoped abstraction (owns a `root: Locator`). No shared base class. |
| Q3 | **Component children are `readonly` fields** initialized via `this.$(selector)`. Closest to today's `@FindBy` ergonomics. |
| Q4 | **Parameterized locators are methods** returning `Locator` (`rowByName(name)`). No framework-level template abstraction. |
| Q5 | **Proxy-wrapped locators** (`xLocator`) auto-log every action with the field name (`addFormButton`) — recovered via a post-construction name-binding scan of `this`. |
| Q6 | **Soft assertions via `softGroup(title, fn)`** wrapping `expect.soft`. Extensible helper library (`assertVisible`, `assertTextContains`, `assertAttributeEquals`, …). Outside a group, same helpers are hard asserts. |
| Q7 | **Reporting:** `allure-playwright` + Playwright's built-in HTML reporter + `trace: 'retain-on-failure'`. No bespoke reporter. |
| Q8 | **Runner:** single Playwright project, file-level parallelism, groups via tags (`@ui`, `@unit`) and `--grep`. |
| Q9 | **Config:** typed, validated config module (fail-fast on missing required keys). Fixture HTTP server as a worker-scoped Playwright fixture. Remote grid deferred. |
| Q10 | **AI skills:** port `.claude/skills/*` 1:1 in content, extend the review gate with DSL-specific rules, add a `create-component` skill. |
| Q11 | **Locator hygiene:** ESLint rules (`no-raw-locator-in-tests`, `no-goto-outside-page-objects`) + review skill. Build-time, not just review-time. |
| Q12 | **Flake handling:** `retries: process.env.CI ? 2 : 0`. Highlight via opt-in `HIGHLIGHT=1` env var. |
| Q13 | **Naming prefix:** `x`. `xComponent`, `xPage`, `xAssert`, `xLogger`, `xLocator`. |

---

## 1. Analysis recap — what must and must not port

### Preserve as-is (ideas, not code)
- Named element logging (`INFO: Click on addFormButton (#selector)`).
- Component scoping — parent locator + children resolved inside it.
- Nested reusable components (recursive initialization).
- Parameterized/template locators (reshaped to methods).
- Soft-assert aggregate blocks with a heading.
- AI workflow: 6-stage pipeline, review gate, severity ratings, PO/component templates.
- "No raw locators in tests" invariant.

### Adapt to Playwright idioms
- `@FindBy` reflection → `readonly` field initializers (`this.$('…')`).
- `parentElement.findElement(child)` → `parent.locator(child)` chaining.
- `iWebElementsList` + CSS/XPath index split → `Locator.nth(i)` / `.all()`.
- `iAssert.assertAll(...)` → `softGroup(title, fn)` over `expect.soft`.
- `@PageURL` class-hierarchy walk → small URL composer on `xPage` subclasses.
- TestNG groups → Playwright tags + `--grep`.
- `TestListener` + debug-buffer flush → attach logs only for failed tests via Playwright `Reporter` hook or a worker fixture.

### Replace with native Playwright (drop the custom layer)
- `WebDriverWait` + `@Waiter(waitFor=N)` → Playwright auto-wait; per-call `{ timeout }` only when needed.
- `@CacheElement` / `CacheValue` → **delete entirely.** Locators aren't resolved DOM references.
- `HiddenElementCondition` click fallback → Playwright auto-retries until actionable.
- JS fallbacks (`scrollIntoView`, `focus`, `value=''`, cursor positioning) → native `Locator` methods.
- WebDriverManager → `playwright install`.
- Custom HTML artifacts reporter → Playwright HTML reporter + trace viewer.

### Drop entirely
- `DriverFactory` ThreadLocal fallback (Playwright passes `page` explicitly).
- `iPageFactory` reflection machinery.
- `Environment.normalizeRootUrl` regex (latent bug).
- TestRail ID extraction from `@Test(description=...)` — if wanted, re-add as a tag parser (`@TR-1234`) on test titles.

---

## 2. Target architecture

### 2.1 Layers

```
┌─────────────────────────────────────────────────────┐
│ tests/                          Test specs           │  test code
├─────────────────────────────────────────────────────┤
│ pages/  components/             Application model    │  app code
├─────────────────────────────────────────────────────┤
│ assertions/                     Helper library       │  framework code
│ fixtures/                       Playwright fixtures  │
│ framework/core/                 xPage, xComponent,   │
│                                 xLocator (proxy),    │
│                                 xLogger              │
│ framework/config/               Typed env config     │
│ framework/reporting/            Allure wiring        │
├─────────────────────────────────────────────────────┤
│ @playwright/test, allure-playwright                  │  vendor
└─────────────────────────────────────────────────────┘
```

Rule: test code imports only from `pages/`, `assertions/`, and the `test` fixture. It **never** imports `@playwright/test` directly except the `expect`-free symbols it truly needs (discouraged — prefer helpers).

### 2.2 Folder structure

```
/
├── framework/
│   ├── core/
│   │   ├── xPage.ts
│   │   ├── xComponent.ts
│   │   ├── xLocator.ts          # Proxy wrapper + name binding
│   │   └── xLogger.ts
│   ├── config/
│   │   ├── env.ts               # typed, validated
│   │   └── schema.ts
│   ├── reporting/
│   │   ├── allure.ts            # step/attachment helpers
│   │   └── highlight.ts         # HIGHLIGHT=1 behavior
│   └── fixtures/
│       ├── fixture-server.ts    # worker-scoped HTTP server
│       └── app.fixture.ts       # exposes { logger, page } to tests
├── assertions/
│   ├── index.ts                 # re-exports
│   ├── soft.ts                  # softGroup + mode stack
│   ├── visibility.ts            # assertVisible, assertHidden
│   ├── text.ts                  # assertTextEquals, assertTextContains
│   ├── attribute.ts             # assertAttributeEquals, ...
│   └── state.ts                 # assertEnabled, assertChecked
├── pages/                       # app-specific xPage subclasses
├── components/                  # reusable xComponent subclasses
├── tests/
│   ├── ui/                      # tagged @ui
│   └── unit/                    # tagged @unit, no browser
├── .claude/skills/              # ported AI skills
├── eslint.config.js             # custom rules
├── playwright.config.ts
└── package.json
```

### 2.3 Naming conventions

| Artifact | Convention | Example |
|---|---|---|
| Framework class | `x`-prefix, PascalCase | `xComponent`, `xPage`, `xLogger` |
| App page | `*Page` suffix | `LoginPage`, `DashboardPage` |
| App component | `*Component` suffix | `LoginForm` → `LoginFormComponent` |
| Test file | `*.spec.ts` | `login.spec.ts` |
| Assertion helper | `assert*` camelCase | `assertTextContains` |
| Fixture | `*.fixture.ts` | `app.fixture.ts` |
| Env var | `UPPER_SNAKE` | `BASE_URL`, `HIGHLIGHT` |

### 2.4 Boundaries

| Boundary | Rule | Enforced by |
|---|---|---|
| Tests may not call `page.locator` / `page.getByRole` / `page.goto` | Always through page/component | ESLint rule + review skill |
| Components may not call `page.locator` (must use `this.$` / chained `this.root.locator`) | Ensures children get name binding | ESLint rule |
| Pages may not extend `xComponent` | Q2 decision | ESLint rule + review skill |
| Assertions in tests go through helpers | Not raw `expect(...)` | ESLint rule (warn) + review skill (HIGH) |
| `this.$` accepts string selector only (not `Locator`) | Keeps name-binding scan reliable | Type signature |

---

## 3. Core abstractions — concrete shapes

### 3.1 `xLocator` — the Proxy-wrapped Locator

```ts
// framework/core/xLocator.ts
export type xLocator = Locator & { readonly __meta: LocatorMeta };
interface LocatorMeta { selector: string; name?: string; parent?: string; }

export function wrapLocator(loc: Locator, meta: LocatorMeta): xLocator {
  const logged = new Set(['click','fill','check','uncheck','hover','press',
                          'selectOption','setInputFiles','dblclick','tap','focus','blur']);
  return new Proxy(loc, {
    get(target, prop, receiver) {
      if (prop === '__meta') return meta;
      const value = Reflect.get(target, prop, receiver);
      if (typeof value !== 'function') return value;
      // Re-wrap chained locators so names propagate
      if (prop === 'locator' || prop === 'filter' || prop === 'nth' ||
          prop === 'first' || prop === 'last' || prop === 'getByRole' /* … */) {
        return (...args: unknown[]) => {
          const child = (value as Function).apply(target, args) as Locator;
          const childName = meta.name ? `${meta.name}›${String(prop)}(${args[0] ?? ''})` : undefined;
          return wrapLocator(child, { selector: `${meta.selector} › ${String(prop)}`, name: childName });
        };
      }
      if (logged.has(String(prop))) {
        return async (...args: unknown[]) => {
          const displayName = meta.name ?? meta.selector;
          await xLogger.step(`${capitalize(String(prop))} on ${displayName} (${meta.selector})`,
            () => (value as Function).apply(target, args));
        };
      }
      return (value as Function).bind(target);
    },
  }) as xLocator;
}
```

### 3.2 `xComponent` — the base

```ts
// framework/core/xComponent.ts
export abstract class xComponent {
  constructor(public readonly root: xLocator) {
    // Fields are initialized AFTER super() but BEFORE this microtask fires.
    queueMicrotask(() => this.#bindNames());
  }
  protected $(selector: string): xLocator {
    return wrapLocator(this.root.locator(selector), { selector });
  }
  #bindNames() {
    for (const [key, val] of Object.entries(this)) {
      if (isXLocator(val) && !val.__meta.name) {
        (val.__meta as Mutable<LocatorMeta>).name = key;
      }
      if (val instanceof xComponent) {
        // nested components: their fields already self-bound via their own microtask
        (val.root.__meta as Mutable<LocatorMeta>).name = key;
      }
    }
  }
}
```

### 3.3 `xPage` — the navigable root

```ts
// framework/core/xPage.ts
export abstract class xPage {
  constructor(protected readonly page: Page) {}
  abstract readonly path: string;                // e.g. '/login'
  async open(): Promise<this> {
    await this.page.goto(env.baseURL + this.path);
    await this.isOpened();
    return this;
  }
  abstract isOpened(): Promise<void>;            // required, parallels Java rule
  protected $(selector: string): xLocator {
    return wrapLocator(this.page.locator(selector), { selector });
  }
}
```

### 3.4 Example — a page with a component

```ts
// components/LoginFormComponent.ts
export class LoginFormComponent extends xComponent {
  readonly username = this.$('input[name=username]');
  readonly password = this.$('input[name=password]');
  readonly submit   = this.$('button[type=submit]');
  readonly error    = this.$('.error-message');

  async loginAs(user: string, pass: string): Promise<void> {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.submit.click();
  }
}

// pages/LoginPage.ts
export class LoginPage extends xPage {
  readonly path = '/login';
  readonly form = new LoginFormComponent(this.$('#login-form') as xLocator);
  async isOpened() { await expect(this.form.root).toBeVisible(); }
}

// tests/ui/login.spec.ts
test('valid credentials log in @ui', async ({ page }) => {
  const login = await new LoginPage(page).open();
  await login.form.loginAs('alice', 'pw');
  await assertVisible(new DashboardPage(page).header);
});
```

Log output for the click: `INFO: Click on submit (button[type=submit])` — because the name-binding scan captured `submit` from the field name on `LoginFormComponent`.

### 3.5 Parameterized locators (Q4-A)

```ts
export class UsersTableComponent extends xComponent {
  readonly rows = this.$('tbody tr');
  rowByName(name: string): xLocator {
    return wrapLocator(
      this.root.locator(`tbody tr:has-text(${JSON.stringify(name)})`),
      { selector: `row[${name}]`, name: `rowByName(${name})` },
    );
  }
}
```

### 3.6 Assertion helpers + `softGroup`

```ts
// assertions/soft.ts
const modeStack: Array<'hard'|'soft'> = ['hard'];
export const current = () => modeStack[modeStack.length - 1] === 'soft'
  ? { expect: expect.soft } : { expect };

export async function softGroup(title: string, fn: () => Promise<void>) {
  return allure.step(title, async () => {
    modeStack.push('soft');
    try { await fn(); } finally { modeStack.pop(); }
  });
}

// assertions/visibility.ts
export async function assertVisible(loc: xLocator, message?: string) {
  const title = message ?? `${loc.__meta.name ?? loc.__meta.selector} is visible`;
  await allure.step(title, () => current().expect(loc).toBeVisible());
}
```

---

## 4. Feature-mapping table

| # | Today (Selenium/Java) | Playwright/TS equivalent | Migration note | Phase |
|---|---|---|---|---|
| 1 | `iWebElement` with logged actions | `xLocator` Proxy | Name binding via post-construction scan | MVP |
| 2 | `@FindBy` + `iPageFactory` reflection | `readonly` fields via `this.$('...')` | Delete reflection engine | MVP |
| 3 | `parentElement` scoping | `this.root.locator(child)` chaining | Native | MVP |
| 4 | `iWebElementsList` + IndexedListItem | `locator.nth(i)` / `.all()` | CSS/XPath split disappears | MVP |
| 5 | Template locators (`%s` + `.template()`) | Methods returning `xLocator` | Q4-A | MVP |
| 6 | `@CacheElement` / `CacheValue` | **Dropped** | Locators are already lightweight | MVP |
| 7 | `WebDriverWait` + `@Waiter` | Auto-wait; `{ timeout: N }` when needed | Drop annotation | MVP |
| 8 | `iAssert.assertAll(heading, …)` | `softGroup(title, fn)` + helpers | Q6 | MVP |
| 9 | Hard asserts (`iAssert.equalsTo`, …) | Assertion helper library | Extensible module | MVP |
| 10 | Allure integration | `allure-playwright` | Direct | MVP |
| 11 | Custom HTML artifacts reporter | Playwright HTML + trace viewer | Dropped | MVP |
| 12 | Debug buffer, flush on failure | Attach logs via Reporter `onTestEnd` | INFO goes to Allure steps; DEBUG attached only on fail | MVP |
| 13 | Screenshots | `trace: 'retain-on-failure'` + `attachment` on fail | Native | MVP |
| 14 | Element highlight | `HIGHLIGHT=1` env → Proxy `beforeAction` hook | Opt-in | Phase 3 |
| 15 | TestNG groups | Tags (`@ui`, `@unit`) + `--grep` | Q8 | MVP |
| 16 | `@PageURL` hierarchy walk | `readonly path` field on `xPage` | Simple, no walk needed | MVP |
| 17 | `LocalTestPageServer` | Worker-scoped fixture (`fixture-server.ts`) | Isolation per worker | MVP |
| 18 | Properties + `Environment` | Typed validated `env.ts` | Fail-fast at boot | MVP |
| 19 | TestRail ID extraction | Tag parser `@TR-\d+` | Phase 3 | Later |
| 20 | LambdaTest remote | `browserType.connect()` provider | Deferred | Later |
| 21 | `DriverFactory` ThreadLocal | **Dropped** (Playwright passes `page` explicitly) | — | MVP |
| 22 | Review skill | Ported + DSL rules + `create-component` skill | Q10 | Phase 4 |
| 23 | ESLint locator hygiene | New custom rules | Q11 | Phase 4 |
| 24 | Retries | `retries: CI ? 2 : 0` | Q12 | MVP |

---

## 5. Implementation roadmap

### Phase 1 — Foundation (1–2 days)

**Objective:** Build scaffolding so real work can start.

**Scope**
- `package.json` with `@playwright/test`, `allure-playwright`, TypeScript strict, tsconfig paths.
- `playwright.config.ts`: one project, `fullyParallel: false` at file level, `retries`, `trace: 'retain-on-failure'`, reporters (`html`, `allure-playwright`, `list`).
- `framework/config/env.ts` with validation (throws on missing `BASE_URL`).
- ESLint config skeleton.
- CI script (npm scripts: `test`, `test:ui`, `test:unit`, `report`).

**Key decisions**
- TypeScript strict + `noUncheckedIndexedAccess` on.
- Node version pinned in `.nvmrc`.

**Tasks:** init repo structure, wire Allure, smoke test passes.

**Risks:** Allure/Playwright versions out of sync. **Validation:** `npm test` on a hello-world spec, Allure report opens.

---

### Phase 2 — Core abstractions (2–3 days)

**Objective:** `xLocator`, `xComponent`, `xPage`, `xLogger` working end-to-end with one demo page.

**Scope**
- `xLocator` Proxy: action logging, chained-locator re-wrapping, meta propagation.
- `xComponent`: constructor, `this.$`, name-binding microtask scan, nested-component name assignment.
- `xPage`: `open()`, `isOpened()` contract.
- `xLogger`: wraps `console`/`allure.step`; `step()` helper used by the Proxy.
- One demo `LoginPage` + `LoginFormComponent` + one spec proving action logs emit `Click on submit (…)`.

**Key decisions**
- Proxy forwards which methods? Explicit allowlist for logged actions; everything else passes through. Chained-locator methods re-wrap. `expect` reads must pass through untouched.
- Name binding timing: `queueMicrotask` runs after synchronous field initializers of the most-derived class — verified by a unit test.

**Tasks (TDD):**
1. Unit tests: `wrapLocator` logs `click` with meta.
2. Unit tests: chained `.locator()` preserves name lineage.
3. Unit tests: `xComponent` binds names on fields.
4. Unit tests: nested `xComponent` assigns name to its root.
5. Integration: demo spec produces expected log lines.

**Risks**
- Proxy hides TypeScript method signatures if not typed as `Locator`. **Mitigation:** type assertion `as xLocator` = `Locator & { __meta }` preserves all methods.
- `expect(locator).toBeVisible()` behavior under Proxy. **Validation:** spec that uses `expect` against an `xLocator` must pass.

---

### Phase 3 — Assertions, reporting, config, fixtures (2 days)

**Objective:** Everything a test author needs beyond core abstractions.

**Scope**
- `assertions/` library: `softGroup`, `assertVisible/Hidden`, `assertTextEquals/Contains`, `assertAttributeEquals/Present`, `assertEnabled/Disabled/Checked/Unchecked`, `assertCount`, `assertUrl`.
- Allure step wrappers on each helper.
- Fixture-server worker fixture (express-based).
- `HIGHLIGHT=1` Proxy hook: before logged actions, `locator.evaluate(el => el.style.outline='2px solid red')`.
- Trace/screenshot on failure via Playwright config (no custom code).

**Key decisions**
- Soft mode implementation: module-level stack is acceptable because workers are single-threaded in Node. Document the constraint.
- Highlight only in headed mode — guard with a config check.

**Tasks:** write each helper + one spec per helper verifying hard and soft behavior.

**Risks**
- Parallel `softGroup` calls in the same worker — forbidden by design (tests within a file are serial). Document.

---

### Phase 4 — AI workflow + ESLint enforcement (2 days)

**Objective:** Port `.claude/skills/*` and add build-time guardrails.

**Scope**
- Port `ai-write-test`, `create-page-object`, `create-component` (new), `review-automation-code`, `playwright-cli` (optional), `ORCHESTRATION.md`.
- Rewrite review severity rules for TS/Playwright:
  - HIGH: raw `page.locator` / `page.goto` in `tests/**`.
  - HIGH: `page.locator` in `components/**` (must use `this.$`).
  - HIGH: `xPage` subclass extending `xComponent`.
  - HIGH: raw `expect` in tests when a helper exists.
  - MEDIUM: parameterized locator stored as field instead of method.
  - MEDIUM: missing `isOpened()` override.
- Custom ESLint rules:
  - `xframework/no-raw-locator-in-tests`
  - `xframework/no-goto-outside-page-objects`
  - `xframework/no-page-locator-in-components`
  - `xframework/page-must-implement-is-opened` (type-aware, via `@typescript-eslint`).

**Key decisions**
- ESLint rules live in `/eslint-plugin-xframework/` as an internal workspace package.
- Review skill calls out ESLint violations specifically (severity = same as the rule's category).

**Tasks:** port each skill markdown, author 4 ESLint rules, seed rule tests, wire into CI.

**Risks**
- Type-aware ESLint is slow. **Mitigation:** only the `page-must-implement-is-opened` rule needs types; others are AST-only.

---

### Phase 5 — Migration examples + hardening (2–3 days)

**Objective:** Prove the framework on representative flows and harden rough edges.

**Scope**
- Port 3–5 existing test cases from the Java repo as reference examples.
- Document the "what's different" guide for Selenium-habits authors.
- Stress test: 50+ tests running in parallel, trace on failure verified, Allure reports stable.
- Performance pass on `xLocator` Proxy (microbenchmark).
- README, CONTRIBUTING, examples directory.

**Risks**
- Proxy overhead on tight `Locator.all()` loops. **Validation:** benchmark; fall back to unwrapped `Locator` for high-volume internal iteration if needed.

---

## 6. MVP vs later

### MVP (Phases 1–4)
- `xLocator` with action logging and name binding.
- `xComponent`, `xPage` with nested component support.
- Parameterized locators as methods.
- Assertion helper library + `softGroup`.
- Allure + Playwright HTML + trace on failure.
- Typed config + fixture server.
- AI skills ported + extended.
- ESLint hygiene rules.
- Retries in CI.
- Tag-based grouping.

### Later (post-MVP)
- Element highlight (`HIGHLIGHT=1`).
- TestRail tag parser.
- Remote grid provider (BrowserStack/LambdaTest via `browserType.connect()`).
- Flake classifier on top of Allure retries.
- Visual testing (`toHaveScreenshot`).
- API test helpers (`request` fixture wrapper).
- Network mocking conventions.

---

## 7. Risks and trade-offs

| Risk / trade-off | Notes |
|---|---|
| **Proxy obscures types in IDE tooltips.** | Mitigated by `xLocator = Locator & { __meta }` intersection. Worst case: authors see `Locator` (acceptable — that's the point). |
| **Name binding relies on `Object.entries(this)` after microtask.** | Works for `readonly` fields initialized in class body. Fails if a field is assigned lazily from a method. **Document:** children must be field initializers, not method-assigned. ESLint rule enforces. |
| **Soft-mode module stack is not re-entrant-safe across concurrent async flows.** | Intentional: tests in a file are serial in Playwright. Don't call `softGroup` from background tasks. |
| **Allure + Playwright HTML reporter is dual maintenance.** | Low cost; both are config-only. Dropping Playwright HTML loses trace-viewer entry point; dropping Allure loses cross-run aggregation. Keep both. |
| **No custom cache layer when porting a suite that relied on `@CacheElement`.** | No real regression: Playwright `Locator` doesn't re-query until used. The Java cache was already vestigial. |
| **Authors used to `PageFactory` reflection may try to annotate fields.** | Review skill calls this out; migration doc explains the new idiom. |
| **`xLocator` Proxy adds a frame to stack traces.** | Negligible in practice; trace viewer shows semantic steps. |
| **ESLint rule maintenance.** | Small; rules are AST patterns. Worth the deterministic enforcement. |
| **Tests can still import `@playwright/test` `expect` directly and bypass helpers.** | Soft-enforced (warn). The helper library must cover common cases well enough that authors reach for it first. |

---

## 8. Migration strategy for Selenium/PageFactory authors

1. **Mental-model swap table** in the migration guide:

   | Selenium habit | Playwright-TS equivalent |
   |---|---|
   | `@FindBy(css = "…") iWebElement foo;` | `readonly foo = this.$('…');` |
   | `new PageObject()` then `openPage()` | `await new LoginPage(page).open()` |
   | `foo.click()` auto-logs | same — `xLocator` Proxy |
   | `foo.template("X").click()` | `foo('X').click()` (method, not field) |
   | `iAssert.assertAll("title", ()->…, ()->…)` | `await softGroup('title', async () => { await assert…; await assert…; })` |
   | `@Waiter(waitFor=30)` | `{ timeout: 30_000 }` per call |
   | `@CacheElement` | remove — unnecessary |
   | `DriverFactory.getCurrentDriver()` | `page` fixture, passed explicitly |

2. **Side-by-side example repo** (one Java test + its TS port) in `docs/migration/`.
3. **Review gate teaches the pattern.** First-week PRs will trip review rules; that's the intended feedback loop.
4. **Do not port tests 1:1 mechanically** — re-express them using component methods so the TS version reads better than the Java original.

---

## 9. Example deliverables to create

### Docs
- `README.md` — quickstart, decisions summary, links to skills.
- `docs/architecture.md` — layers, xComponent/xPage/xLocator explained.
- `docs/writing-pages.md` — conventions (parallels Java `writing-pages.md`).
- `docs/writing-components.md` — new.
- `docs/writing-tests.md` — test shape, tags, fixtures.
- `docs/assertions.md` — helper catalog + `softGroup`.
- `docs/migration.md` — Selenium→Playwright habit swap.
- `docs/ai-workflow.md` — how skills orchestrate.

### Framework code
- `framework/core/{xLocator,xComponent,xPage,xLogger}.ts`
- `framework/config/env.ts`
- `framework/fixtures/{app,fixture-server}.fixture.ts`
- `framework/reporting/{allure,highlight}.ts`
- `assertions/*.ts` (visibility, text, attribute, state, soft, index)
- `eslint-plugin-xframework/` (4 rules + tests)

### Examples
- `pages/LoginPage.ts`, `pages/DashboardPage.ts`
- `components/LoginFormComponent.ts`, `components/UsersTableComponent.ts` (parameterized row example)
- `tests/ui/login.spec.ts`, `tests/ui/users-table.spec.ts`
- `tests/unit/xLocator.spec.ts`, `tests/unit/xComponent.spec.ts` (framework self-tests)

### Configs
- `playwright.config.ts`
- `tsconfig.json` (strict, path aliases)
- `eslint.config.js`
- `.env.example`
- `.nvmrc`
- CI workflow file (GitHub Actions template)

### AI skills (`.claude/skills/`)
- `ai-write-test/SKILL.md` (TS variant)
- `create-page-object/SKILL.md` (TS variant)
- `create-component/SKILL.md` (new)
- `review-automation-code/SKILL.md` (TS variant, DSL rules)
- `playwright-cli/SKILL.md` (retained — DOM capture during authoring)
- `ORCHESTRATION.md` (port)

---

## 10. Open items to revisit after Phase 2

These were deliberately deferred — decide once the core is running, not speculatively now.

- Whether `xComponent` should support **dynamic roots** (root as a function, not a fixed Locator) for tables whose rows host components. Likely yes; add in Phase 3 if demand appears.
- Whether `softGroup` should **bail early** on the first assertion throwing a non-assertion error (e.g., navigation failure). Default: yes — only `AssertionError`-shaped failures accumulate.
- Whether to expose a **headed-only "slow-mo"** toggle alongside `HIGHLIGHT=1`. Trivial to add; decide after first demo.
- Whether to add a **`xPage.waitForReady()`** hook distinct from `isOpened()` for flows where "URL loaded" ≠ "page interactive". Leave out of MVP; add if a real case appears.
