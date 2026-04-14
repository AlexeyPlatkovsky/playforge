import { expect, test } from "@playwright/test";

type Mode = "hard" | "soft";

type ExpectFn = typeof expect | typeof expect.soft;

const modeStack: Mode[] = ["hard"];

export function currentMode(): Mode {
  return modeStack[modeStack.length - 1] ?? "hard";
}

export function currentExpect(): ExpectFn {
  return currentMode() === "soft" ? expect.soft : expect;
}

export async function softGroup(title: string, fn: () => Promise<void>): Promise<void> {
  await test.step(title, async () => {
    modeStack.push("soft");
    try {
      await fn();
    } finally {
      modeStack.pop();
    }
  });
}

export function __pushModeForTesting(mode: Mode): void {
  modeStack.push(mode);
}

export function __popModeForTesting(): void {
  if (modeStack.length > 1) {
    modeStack.pop();
  }
}

export function __resetModeForTesting(): void {
  modeStack.length = 0;
  modeStack.push("hard");
}
