import { expect, test } from "@playwright/test";

import {
  __popModeForTesting,
  __pushModeForTesting,
  __resetModeForTesting,
  currentMode,
  softGroup
} from "../../assertions/soft";

test.beforeEach(() => {
  __resetModeForTesting();
});

test("currentMode defaults to hard outside softGroup @unit", () => {
  expect(currentMode()).toBe("hard");
});

test("softGroup pushes soft mode inside its body and restores after @unit", async () => {
  const observed: string[] = [];

  await softGroup("demo group", () => {
    observed.push(currentMode());
    return Promise.resolve();
  });

  expect(observed).toEqual(["soft"]);
  expect(currentMode()).toBe("hard");
});

test("softGroup restores mode if the body throws @unit", async () => {
  await expect(async () => {
    await softGroup("throwing", () => {
      throw new Error("boom");
    });
  }).rejects.toThrow("boom");

  expect(currentMode()).toBe("hard");
});

test("nested mode pushes expose the innermost value @unit", () => {
  __pushModeForTesting("soft");
  __pushModeForTesting("hard");
  expect(currentMode()).toBe("hard");
  __popModeForTesting();
  expect(currentMode()).toBe("soft");
  __popModeForTesting();
  expect(currentMode()).toBe("hard");
});
