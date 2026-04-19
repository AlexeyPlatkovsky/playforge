import type { Rule } from "eslint";

export interface XFrameworkPlugin {
  meta: { name: string; version: string };
  rules: Record<string, Rule.RuleModule>;
  configs: Record<string, unknown>;
}

declare const plugin: XFrameworkPlugin;
export default plugin;
