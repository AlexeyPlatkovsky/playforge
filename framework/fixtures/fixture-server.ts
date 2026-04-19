import http, { type IncomingMessage, type Server, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";

export interface FixtureServerHandle {
  readonly baseURL: string;
  close(): Promise<void>;
  setRoutes(routes: Record<string, RouteHandler>): void;
}

export type RouteHandler = (request: IncomingMessage, response: ServerResponse) => void | Promise<void>;

export interface FixtureServerOptions {
  host?: string;
  initialRoutes?: Record<string, RouteHandler>;
  port?: number;
}

function defaultNotFound(_request: IncomingMessage, response: ServerResponse): void {
  response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
  response.end("not found");
}

function readRequestUrl(request: IncomingMessage): URL {
  const host = request.headers.host ?? "127.0.0.1";
  return new URL(request.url ?? "/", `http://${host}`);
}

export async function startFixtureServer(
  options: FixtureServerOptions = {}
): Promise<FixtureServerHandle> {
  const host = options.host ?? "127.0.0.1";
  const port = options.port ?? 0;
  let routes: Record<string, RouteHandler> = { ...options.initialRoutes };

  const server: Server = http.createServer((request, response) => {
    const url = readRequestUrl(request);
    const route = routes[url.pathname];

    if (route) {
      void Promise.resolve(route(request, response)).catch((error: unknown) => {
        response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
        response.end(`fixture route threw: ${String(error)}`);
      });
      return;
    }

    defaultNotFound(request, response);
  });

  await new Promise<void>((resolve, reject) => {
    const onError = (error: Error): void => {
      server.off("listening", onListen);
      reject(error);
    };
    const onListen = (): void => {
      server.off("error", onError);
      resolve();
    };
    server.once("error", onError);
    server.once("listening", onListen);
    server.listen(port, host);
  });

  const address = server.address() as AddressInfo;

  return {
    baseURL: `http://${host}:${String(address.port)}`,
    async close(): Promise<void> {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    },
    setRoutes(next: Record<string, RouteHandler>): void {
      routes = { ...next };
    }
  };
}

export function htmlResponse(html: string): RouteHandler {
  return (_request, response) => {
    response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    response.end(html);
  };
}

export function textResponse(text: string, status = 200): RouteHandler {
  return (_request, response) => {
    response.writeHead(status, { "content-type": "text/plain; charset=utf-8" });
    response.end(text);
  };
}

export function jsonResponse(payload: unknown, status = 200): RouteHandler {
  return (_request, response) => {
    response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
    response.end(JSON.stringify(payload));
  };
}
