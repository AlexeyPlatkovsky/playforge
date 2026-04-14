import { test as base } from "@playwright/test";

import { xLogger } from "../core/xLogger";
import {
  type FixtureServerHandle,
  type RouteHandler,
  htmlResponse,
  startFixtureServer
} from "./fixture-server";

export interface TestFixtures {
  logger: typeof xLogger;
  mountHtml: (html: string, path?: string) => Promise<string>;
}

export interface WorkerFixtures {
  fixtureServer: FixtureServerHandle;
}

export const test = base.extend<TestFixtures, WorkerFixtures>({
  fixtureServer: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      const server = await startFixtureServer();
      await use(server);
      await server.close();
    },
    { scope: "worker" }
  ],
  // eslint-disable-next-line no-empty-pattern
  logger: async ({}, use) => {
    xLogger.resetForTesting();
    await use(xLogger);
    xLogger.resetForTesting();
  },
  mountHtml: async ({ fixtureServer }, use) => {
    const routes: Record<string, RouteHandler> = {};
    const mount = (html: string, path = "/"): Promise<string> => {
      routes[path] = htmlResponse(html);
      fixtureServer.setRoutes(routes);
      return Promise.resolve(`${fixtureServer.baseURL}${path}`);
    };
    await use(mount);
    fixtureServer.setRoutes({});
  }
});

export { expect } from "@playwright/test";
