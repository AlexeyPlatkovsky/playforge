import http from "node:http";

const baseUrl = new URL(process.env.BASE_URL ?? "http://127.0.0.1:3407");
const hostname = baseUrl.hostname;
const port = Number(baseUrl.port || "3407");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Login</title>
    <style>
      body {
        font-family: "Iowan Old Style", "Palatino Linotype", serif;
        margin: 0;
        min-height: 100vh;
        background:
          radial-gradient(circle at top left, rgba(227, 180, 72, 0.35), transparent 32%),
          linear-gradient(135deg, #f3efe2 0%, #d7e5ec 100%);
        color: #18313f;
      }

      main {
        display: grid;
        min-height: 100vh;
        place-items: center;
        padding: 24px;
      }

      section {
        background: rgba(255, 255, 255, 0.88);
        border: 1px solid rgba(24, 49, 63, 0.12);
        border-radius: 20px;
        box-shadow: 0 24px 60px rgba(24, 49, 63, 0.12);
        padding: 32px;
        width: min(420px, 100%);
      }

      h1 {
        margin: 0 0 12px;
      }

      p {
        margin: 0 0 24px;
      }

      label,
      input,
      button {
        display: block;
        width: 100%;
      }

      label {
        margin-bottom: 16px;
        font-size: 0.95rem;
      }

      input {
        margin-top: 6px;
        padding: 10px 12px;
        border: 1px solid rgba(24, 49, 63, 0.2);
        border-radius: 10px;
      }

      button {
        margin-top: 8px;
        padding: 12px 16px;
        border: 0;
        border-radius: 999px;
        background: #18313f;
        color: #f8f5ef;
        cursor: pointer;
      }

      [hidden] {
        display: none !important;
      }
    </style>
  </head>
  <body>
    <main>
      <section data-testid="login-panel">
        <div data-view="login">
          <h1>Component DSL Demo</h1>
          <p>Use the page object and component abstraction to log in.</p>
          <form data-testid="login-form">
            <label>
              Username
              <input name="username" type="text" />
            </label>
            <label>
              Password
              <input name="password" type="password" />
            </label>
            <button type="submit">Sign in</button>
          </form>
        </div>
        <div data-view="dashboard" hidden>
          <h1 data-testid="dashboard-title">Dashboard</h1>
          <p data-testid="dashboard-status">signed-in</p>
        </div>
      </section>
    </main>
    <script>
      const loginView = document.querySelector("[data-view='login']");
      const dashboardView = document.querySelector("[data-view='dashboard']");
      const form = document.querySelector("[data-testid='login-form']");

      const showDashboard = () => {
        document.title = "Dashboard";
        history.replaceState({}, "", "/dashboard");
        loginView.hidden = true;
        dashboardView.hidden = false;
      };

      if (location.pathname === "/dashboard") {
        showDashboard();
      }

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        showDashboard();
      });
    </script>
  </body>
</html>`;

const server = http.createServer((request, response) => {
  if (request.url === "/health") {
    response.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
    response.end("ok");
    return;
  }

  response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  response.end(html);
});

server.listen(port, hostname, () => {
  process.stdout.write(`Smoke app listening on ${baseUrl.origin}\n`);
});
