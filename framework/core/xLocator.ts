import type { Locator } from "@playwright/test";

import { highlightLocator } from "../reporting/highlight";
import { xLogger } from "./xLogger";

export interface LocatorMeta {
  name?: string;
  parent?: LocatorMeta;
  selector: string;
}

export type xLocator = Locator & { readonly __meta: LocatorMeta };

const chainedLocatorMethods = new Set([
  "filter",
  "first",
  "getByAltText",
  "getByLabel",
  "getByPlaceholder",
  "getByRole",
  "getByTestId",
  "getByText",
  "getByTitle",
  "last",
  "locator",
  "nth"
]);

const loggedActionMethods = new Set([
  "blur",
  "check",
  "clear",
  "click",
  "dblclick",
  "fill",
  "focus",
  "hover",
  "press",
  "selectOption",
  "setInputFiles",
  "tap",
  "uncheck"
]);

const actionLabels: Record<string, string> = {
  blur: "Blur",
  check: "Check",
  clear: "Clear",
  click: "Click",
  dblclick: "Double click",
  fill: "Fill",
  focus: "Focus",
  hover: "Hover",
  press: "Press",
  selectOption: "Select option",
  setInputFiles: "Set input files",
  tap: "Tap",
  uncheck: "Uncheck"
};

function formatArg(arg: unknown): string {
  if (typeof arg === "string") {
    return arg;
  }

  return JSON.stringify(arg);
}

function chainSegment(method: string, args: unknown[]): string {
  return `${method}(${args.map(formatArg).join(", ")})`;
}

function chainName(meta: LocatorMeta, method: string, args: unknown[]): string | undefined {
  const segment = chainSegment(method, args);
  return meta.name ? `${meta.name}.${segment}` : segment;
}

function actionTitle(method: string, meta: LocatorMeta): string {
  const action = actionLabels[method] ?? method;
  const displayName = meta.name ?? meta.selector;
  return `${action} on ${displayName} (${meta.selector})`;
}

export function isXLocator(value: unknown): value is xLocator {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return Reflect.get(value, "__meta") !== undefined;
}

export function rawLocator(locator: Locator | xLocator): Locator {
  if (isXLocator(locator)) {
    return Reflect.get(locator, "__raw") as Locator;
  }

  return locator;
}

export function wrapLocator(locator: Locator, meta: LocatorMeta): xLocator {
  return new Proxy(locator, {
    get(target, prop, receiver) {
      if (prop === "__meta") {
        return meta;
      }

      if (prop === "__raw") {
        return target;
      }

      const value = Reflect.get(target, prop, receiver) as unknown;

      if (typeof prop !== "string" || typeof value !== "function") {
        return value;
      }

      if (prop === "constructor") {
        return value;
      }

      const callable = value as (...args: unknown[]) => unknown;

      if (chainedLocatorMethods.has(prop)) {
        return (...args: unknown[]) => {
          const child = callable.apply(target, args) as Locator;
          const segment = chainSegment(prop, args);

          return wrapLocator(child, {
            name: chainName(meta, prop, args),
            parent: meta,
            selector: `${meta.selector} >> ${segment}`
          });
        };
      }

      if (loggedActionMethods.has(prop)) {
        return async (...args: unknown[]) => {
          return await xLogger.step(actionTitle(prop, meta), async () => {
            await highlightLocator(target);
            return await Promise.resolve(callable.apply(target, args));
          });
        };
      }

      return callable.bind(target) as (...args: unknown[]) => unknown;
    }
  }) as xLocator;
}
