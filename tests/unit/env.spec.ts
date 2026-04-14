import { expect, test } from "@playwright/test";

import { loadEnv } from "../../framework/config/env";
import { parseEnv } from "../../framework/config/schema";

test("env parser accepts the documented baseline @unit", () => {
  const parsed = parseEnv({
    BASE_URL: "http://127.0.0.1:3407",
    HIGHLIGHT: "0",
    TEST_PASSWORD: "",
    TEST_USERNAME: "demo-user"
  });

  expect(parsed.BASE_URL).toBe("http://127.0.0.1:3407");
  expect(parsed.HIGHLIGHT).toBe("0");
  expect(parsed.TEST_PASSWORD).toBeUndefined();
  expect(parsed.TEST_USERNAME).toBe("demo-user");
});

test("typed config converts flags and preserves credentials @unit", () => {
  const config = loadEnv({
    BASE_URL: "http://127.0.0.1:3407",
    HIGHLIGHT: "1",
    TEST_PASSWORD: "secret",
    TEST_USERNAME: "demo-user"
  });

  expect(config.HIGHLIGHT).toBe(true);
  expect(config.TEST_PASSWORD).toBe("secret");
  expect(config.TEST_USERNAME).toBe("demo-user");
});

test("typed config fails fast on missing required values @unit", () => {
  expect(() => loadEnv({ HIGHLIGHT: "0" })).toThrow(/BASE_URL/);
});
