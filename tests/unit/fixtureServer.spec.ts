import { expect, test } from "@playwright/test";

import {
  htmlResponse,
  jsonResponse,
  startFixtureServer,
  textResponse
} from "../../framework/fixtures/fixture-server";

test("fixture server serves registered routes on an ephemeral port @unit", async () => {
  const server = await startFixtureServer({
    initialRoutes: {
      "/": htmlResponse("<h1>hi</h1>"),
      "/api/user": jsonResponse({ name: "demo" }),
      "/status": textResponse("ok")
    }
  });

  try {
    expect(server.baseURL).toMatch(/^http:\/\/127\.0\.0\.1:\d+$/);

    const html = await fetch(`${server.baseURL}/`).then(async (r) => await r.text());
    expect(html).toBe("<h1>hi</h1>");

    const statusRes = await fetch(`${server.baseURL}/status`);
    expect(statusRes.status).toBe(200);
    expect(await statusRes.text()).toBe("ok");

    const apiRes = await fetch(`${server.baseURL}/api/user`);
    expect(apiRes.headers.get("content-type")).toContain("application/json");
    expect(await apiRes.json()).toEqual({ name: "demo" });

    const missing = await fetch(`${server.baseURL}/nope`);
    expect(missing.status).toBe(404);
  } finally {
    await server.close();
  }
});

test("fixture server supports swapping routes at runtime @unit", async () => {
  const server = await startFixtureServer();

  try {
    server.setRoutes({ "/a": textResponse("first") });
    expect(await fetch(`${server.baseURL}/a`).then(async (r) => await r.text())).toBe("first");

    server.setRoutes({ "/b": textResponse("second") });
    expect((await fetch(`${server.baseURL}/a`)).status).toBe(404);
    expect(await fetch(`${server.baseURL}/b`).then(async (r) => await r.text())).toBe("second");
  } finally {
    await server.close();
  }
});
