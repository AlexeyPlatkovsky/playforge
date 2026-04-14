import { performance } from "node:perf_hooks";

import type { Locator } from "@playwright/test";
import { expect, test } from "@playwright/test";

import { rawLocator, wrapLocator } from "../../framework/core/xLocator";

function createBenchLocator(label: string): Locator {
  return {
    locator(selector: string) {
      return createBenchLocator(`${label} >> ${selector}`);
    },
    nth(index: number) {
      return createBenchLocator(`${label}.nth(${String(index)})`);
    }
  } as unknown as Locator;
}

function sample(label: string, iterations: number, fn: (count: number) => void) {
  const runsMs: number[] = [];

  for (let run = 0; run < 6; run += 1) {
    const start = performance.now();
    fn(iterations);
    runsMs.push(Number((performance.now() - start).toFixed(3)));
  }

  const trimmed = runsMs.slice(1);
  const averageMs = trimmed.reduce((sum, value) => sum + value, 0) / trimmed.length;

  return {
    averageMs: Number(averageMs.toFixed(3)),
    label,
    runsMs
  };
}

test("xLocator chain overhead benchmark @benchmark", () => {
  const iterations = 50_000;
  const raw = createBenchLocator("#users");
  const wrapped = wrapLocator(createBenchLocator("#users"), {
    name: "usersTable",
    selector: "#users"
  });

  const results = [
    sample("raw locator chain", iterations, (count) => {
      for (let index = 0; index < count; index += 1) {
        raw.locator("tbody tr").nth(index % 5);
      }
    }),
    sample("wrapped xLocator chain", iterations, (count) => {
      for (let index = 0; index < count; index += 1) {
        wrapped.locator("tbody tr").nth(index % 5);
      }
    }),
    sample("rawLocator fallback from xLocator", iterations, (count) => {
      const internal = rawLocator(wrapped);
      for (let index = 0; index < count; index += 1) {
        internal.locator("tbody tr").nth(index % 5);
      }
    })
  ];

  console.info(
    JSON.stringify(
      {
        iterations,
        results
      },
      null,
      2
    )
  );

  expect(results).toHaveLength(3);
});
