import type { Locator, Page } from "@playwright/test";

export interface RecordedCall {
  readonly args: readonly unknown[];
  readonly method: string;
  readonly target: string;
}

export function createFakeLocator(target: string, calls: RecordedCall[]): Locator {
  const fake = {
    blur: () => {
      calls.push({ args: [], method: "blur", target });
      return Promise.resolve();
    },
    check: () => {
      calls.push({ args: [], method: "check", target });
      return Promise.resolve();
    },
    click: () => {
      calls.push({ args: [], method: "click", target });
      return Promise.resolve();
    },
    dblclick: () => {
      calls.push({ args: [], method: "dblclick", target });
      return Promise.resolve();
    },
    fill: (value: string) => {
      calls.push({ args: [value], method: "fill", target });
      return Promise.resolve();
    },
    first: () => {
      calls.push({ args: [], method: "first", target });
      return createFakeLocator(`${target}.first()`, calls);
    },
    focus: () => {
      calls.push({ args: [], method: "focus", target });
      return Promise.resolve();
    },
    hover: () => {
      calls.push({ args: [], method: "hover", target });
      return Promise.resolve();
    },
    locator: (selector: string) => {
      calls.push({ args: [selector], method: "locator", target });
      return createFakeLocator(`${target} >> ${selector}`, calls);
    },
    nth: (index: number) => {
      calls.push({ args: [index], method: "nth", target });
      return createFakeLocator(`${target}.nth(${String(index)})`, calls);
    },
    press: (key: string) => {
      calls.push({ args: [key], method: "press", target });
      return Promise.resolve();
    },
    uncheck: () => {
      calls.push({ args: [], method: "uncheck", target });
      return Promise.resolve();
    }
  };

  return fake as unknown as Locator;
}

export function createFakePage(calls: RecordedCall[]) {
  const state = {
    isOpenedCalls: 0,
    navigatedTo: undefined as string | undefined
  };

  const page = {
    goto: (url: string) => {
      calls.push({ args: [url], method: "goto", target: "page" });
      state.navigatedTo = url;
      return Promise.resolve();
    },
    locator: (selector: string) => {
      calls.push({ args: [selector], method: "locator", target: "page" });
      return createFakeLocator(`page >> ${selector}`, calls);
    }
  } as unknown as Page;

  return { page, state };
}

export async function flushMicrotasks(): Promise<void> {
  await new Promise<void>((resolve) => {
    queueMicrotask(resolve);
  });
}
