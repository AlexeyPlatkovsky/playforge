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
      :root {
        color-scheme: light;
      }

      * {
        box-sizing: border-box;
      }

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
        padding: 24px;
      }

      .shell {
        margin: 0 auto;
        width: min(1120px, 100%);
      }

      .card {
        background: rgba(255, 255, 255, 0.88);
        border: 1px solid rgba(24, 49, 63, 0.12);
        border-radius: 20px;
        box-shadow: 0 24px 60px rgba(24, 49, 63, 0.12);
      }

      .login-layout {
        display: grid;
        min-height: calc(100vh - 48px);
        place-items: center;
      }

      .login-panel {
        padding: 32px;
        width: min(420px, 100%);
      }

      h1,
      h2,
      h3,
      p {
        margin-top: 0;
      }

      label,
      input,
      button,
      select {
        display: block;
        width: 100%;
      }

      label {
        margin-bottom: 16px;
        font-size: 0.95rem;
      }

      input,
      select {
        margin-top: 6px;
        padding: 10px 12px;
        border: 1px solid rgba(24, 49, 63, 0.2);
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.9);
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

      button.secondary {
        background: rgba(24, 49, 63, 0.1);
        color: #18313f;
      }

      .dashboard {
        display: grid;
        gap: 20px;
      }

      .dashboard-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 28px 32px 0;
      }

      .status-chip {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        padding: 6px 12px;
        font-size: 0.9rem;
        background: rgba(24, 49, 63, 0.1);
      }

      .dashboard-grid {
        display: grid;
        gap: 20px;
        grid-template-columns: minmax(0, 1.8fr) minmax(280px, 1fr);
        padding: 0 32px 32px;
      }

      .dashboard-main,
      .dashboard-side {
        display: grid;
        gap: 20px;
      }

      .dashboard-block {
        padding: 24px;
      }

      .toolbar {
        display: grid;
        gap: 16px;
        grid-template-columns: minmax(0, 1fr) auto auto;
        align-items: end;
      }

      .checkbox {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        width: auto;
        margin-bottom: 8px;
      }

      .checkbox input {
        margin: 0;
        width: 18px;
        height: 18px;
      }

      .meta-row {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        color: rgba(24, 49, 63, 0.8);
        font-size: 0.95rem;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 16px;
      }

      th,
      td {
        padding: 12px 10px;
        border-top: 1px solid rgba(24, 49, 63, 0.1);
        text-align: left;
        vertical-align: middle;
      }

      .table-actions button {
        margin: 0;
        width: auto;
        padding-inline: 18px;
      }

      .pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 88px;
        border-radius: 999px;
        padding: 4px 10px;
        background: rgba(24, 49, 63, 0.08);
        font-size: 0.88rem;
      }

      .details-grid {
        display: grid;
        gap: 12px;
      }

      .details-item span {
        display: block;
      }

      .details-item span:first-child {
        color: rgba(24, 49, 63, 0.65);
        font-size: 0.88rem;
        margin-bottom: 4px;
      }

      .toast {
        background: rgba(227, 180, 72, 0.28);
        border: 1px solid rgba(227, 180, 72, 0.5);
        border-radius: 16px;
        padding: 12px 14px;
      }

      .dialog {
        display: grid;
        gap: 12px;
      }

      .dialog-actions {
        display: flex;
        gap: 12px;
      }

      .dialog-actions button {
        width: auto;
        flex: 1 1 0;
      }

      [hidden] {
        display: none !important;
      }

      @media (max-width: 860px) {
        .dashboard-header,
        .dashboard-grid {
          padding-inline: 20px;
        }

        .dashboard-grid {
          grid-template-columns: 1fr;
        }

        .toolbar {
          grid-template-columns: 1fr;
        }

        .dialog-actions {
          flex-direction: column;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <div class="shell">
        <section class="login-layout" data-view="login">
          <div class="card login-panel" data-testid="login-panel">
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
        </section>

        <section class="dashboard" data-view="dashboard" hidden>
          <div class="card dashboard-header">
            <div>
              <h1 data-testid="dashboard-title">Team dashboard</h1>
              <p>Reference flows for the Playwright Component-DSL.</p>
            </div>
            <span class="status-chip" data-testid="environment-badge">staging workspace</span>
          </div>

          <div class="dashboard-grid">
            <div class="dashboard-main">
              <section class="card dashboard-block">
                <div class="toolbar">
                  <label>
                    Search users
                    <input data-testid="user-search" name="user-search" placeholder="Name or email" type="text" />
                  </label>
                  <label class="checkbox">
                    <input data-testid="admin-only" type="checkbox" />
                    <span>Admins only</span>
                  </label>
                  <button data-testid="invite-user" type="button">Invite user</button>
                </div>

                <div class="meta-row">
                  <span data-testid="filter-summary"></span>
                  <span data-testid="visible-user-count"></span>
                </div>

                <table data-testid="users-table">
                  <caption data-testid="users-empty" hidden>No users match the current filters.</caption>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </section>
            </div>

            <aside class="dashboard-side">
              <section class="card dashboard-block" data-testid="user-details" hidden>
                <h2>User details</h2>
                <div class="details-grid">
                  <div class="details-item">
                    <span>Name</span>
                    <span data-testid="details-name"></span>
                  </div>
                  <div class="details-item">
                    <span>Email</span>
                    <span data-testid="details-email"></span>
                  </div>
                  <div class="details-item">
                    <span>Role</span>
                    <span data-testid="details-role"></span>
                  </div>
                  <div class="details-item">
                    <span>Status</span>
                    <span data-testid="details-status"></span>
                  </div>
                </div>
              </section>

              <section class="card dashboard-block toast" data-testid="invite-toast" hidden></section>

              <section class="card dashboard-block dialog" data-testid="invite-dialog" hidden>
                <h2>Invite a teammate</h2>
                <form data-testid="invite-form">
                  <label>
                    Name
                    <input data-testid="invite-name" name="invite-name" type="text" />
                  </label>
                  <label>
                    Email
                    <input data-testid="invite-email" name="invite-email" type="email" />
                  </label>
                  <label>
                    Role
                    <select data-testid="invite-role" name="invite-role">
                      <option value="Admin">Admin</option>
                      <option value="Analyst">Analyst</option>
                      <option value="Maintainer">Maintainer</option>
                    </select>
                  </label>
                  <div class="dialog-actions">
                    <button class="secondary" data-testid="invite-cancel" type="button">Cancel</button>
                    <button data-testid="invite-save" type="submit">Send invite</button>
                  </div>
                </form>
              </section>
            </aside>
          </div>
        </section>
      </div>
    </main>
    <script>
      const seedUsers = [
        {
          id: "ada-lovelace",
          name: "Ada Lovelace",
          email: "ada@example.com",
          role: "Admin",
          status: "Active"
        },
        {
          id: "grace-hopper",
          name: "Grace Hopper",
          email: "grace@example.com",
          role: "Admin",
          status: "Pending"
        },
        {
          id: "linus-torvalds",
          name: "Linus Torvalds",
          email: "linus@example.com",
          role: "Maintainer",
          status: "Active"
        },
        {
          id: "margaret-hamilton",
          name: "Margaret Hamilton",
          email: "margaret@example.com",
          role: "Analyst",
          status: "Inactive"
        },
        {
          id: "annie-easley",
          name: "Annie Easley",
          email: "annie@example.com",
          role: "Analyst",
          status: "Active"
        }
      ];

      const state = {
        adminsOnly: false,
        inviteOpen: false,
        search: "",
        selectedId: null,
        toastMessage: "",
        users: seedUsers.map((user) => ({ ...user }))
      };

      const loginView = document.querySelector("[data-view='login']");
      const dashboardView = document.querySelector("[data-view='dashboard']");
      const loginForm = document.querySelector("[data-testid='login-form']");
      const searchInput = document.querySelector("[data-testid='user-search']");
      const adminOnly = document.querySelector("[data-testid='admin-only']");
      const inviteButton = document.querySelector("[data-testid='invite-user']");
      const inviteDialog = document.querySelector("[data-testid='invite-dialog']");
      const inviteForm = document.querySelector("[data-testid='invite-form']");
      const inviteName = document.querySelector("[data-testid='invite-name']");
      const inviteEmail = document.querySelector("[data-testid='invite-email']");
      const inviteRole = document.querySelector("[data-testid='invite-role']");
      const inviteCancel = document.querySelector("[data-testid='invite-cancel']");
      const inviteToast = document.querySelector("[data-testid='invite-toast']");
      const filterSummary = document.querySelector("[data-testid='filter-summary']");
      const visibleUserCount = document.querySelector("[data-testid='visible-user-count']");
      const tableBody = document.querySelector("[data-testid='users-table'] tbody");
      const emptyState = document.querySelector("[data-testid='users-empty']");
      const detailsPanel = document.querySelector("[data-testid='user-details']");
      const detailsName = document.querySelector("[data-testid='details-name']");
      const detailsEmail = document.querySelector("[data-testid='details-email']");
      const detailsRole = document.querySelector("[data-testid='details-role']");
      const detailsStatus = document.querySelector("[data-testid='details-status']");

      const filteredUsers = () => {
        const search = state.search.trim().toLowerCase();
        return state.users.filter((user) => {
          const matchesSearch =
            search.length === 0 ||
            user.name.toLowerCase().includes(search) ||
            user.email.toLowerCase().includes(search);
          const matchesRole = !state.adminsOnly || user.role === "Admin";
          return matchesSearch && matchesRole;
        });
      };

      const renderDetails = (visibleUsers) => {
        const selected = visibleUsers.find((user) => user.id === state.selectedId);
        if (!selected) {
          detailsPanel.hidden = true;
          return;
        }

        detailsPanel.hidden = false;
        detailsName.textContent = selected.name;
        detailsEmail.textContent = selected.email;
        detailsRole.textContent = selected.role;
        detailsStatus.textContent = selected.status;
      };

      const renderTable = (visibleUsers) => {
        tableBody.innerHTML = "";

        for (const user of visibleUsers) {
          const row = document.createElement("tr");
          row.dataset.userId = user.id;
          row.dataset.userName = user.name;
          row.innerHTML = [
            '<td data-col="name"></td>',
            '<td data-col="email"></td>',
            '<td data-col="role"></td>',
            '<td data-col="status"></td>',
            '<td class="table-actions"><button data-testid="view-user" type="button">View</button></td>'
          ].join("");

          row.querySelector("[data-col='name']").textContent = user.name;
          row.querySelector("[data-col='email']").textContent = user.email;
          row.querySelector("[data-col='role']").textContent = user.role;

          const statusCell = row.querySelector("[data-col='status']");
          const pill = document.createElement("span");
          pill.className = "pill";
          pill.textContent = user.status;
          statusCell.appendChild(pill);

          row.querySelector("[data-testid='view-user']").dataset.userId = user.id;
          tableBody.appendChild(row);
        }

        emptyState.hidden = visibleUsers.length !== 0;
      };

      const render = () => {
        const visibleUsers = filteredUsers();
        renderTable(visibleUsers);
        renderDetails(visibleUsers);

        filterSummary.textContent = state.adminsOnly
          ? "Showing admin users only"
          : "Showing all roles";
        visibleUserCount.textContent = String(visibleUsers.length) + " visible users";
        inviteDialog.hidden = !state.inviteOpen;
        inviteToast.hidden = state.toastMessage.length === 0;
        inviteToast.textContent = state.toastMessage;
      };

      const showDashboard = () => {
        document.title = "Dashboard";
        history.replaceState({}, "", "/dashboard");
        loginView.hidden = true;
        dashboardView.hidden = false;
        render();
      };

      const showLogin = () => {
        document.title = "Login";
        history.replaceState({}, "", "/login");
        loginView.hidden = false;
        dashboardView.hidden = true;
      };

      loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        state.toastMessage = "";
        showDashboard();
      });

      searchInput.addEventListener("input", () => {
        state.search = searchInput.value;
        render();
      });

      adminOnly.addEventListener("change", () => {
        state.adminsOnly = adminOnly.checked;
        render();
      });

      tableBody.addEventListener("click", (event) => {
        const button = event.target.closest("[data-testid='view-user']");
        if (!button) {
          return;
        }

        state.selectedId = button.dataset.userId;
        render();
      });

      inviteButton.addEventListener("click", () => {
        state.inviteOpen = true;
        render();
      });

      inviteCancel.addEventListener("click", () => {
        state.inviteOpen = false;
        render();
      });

      inviteForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = inviteName.value.trim();
        const email = inviteEmail.value.trim();
        const role = inviteRole.value;
        const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

        state.users.unshift({
          id,
          name,
          email,
          role,
          status: "Pending"
        });
        state.selectedId = id;
        state.toastMessage = "Invitation sent to " + name;
        state.search = "";
        state.adminsOnly = false;
        searchInput.value = "";
        adminOnly.checked = false;
        inviteForm.reset();
        inviteRole.value = "Admin";
        state.inviteOpen = false;
        render();
      });

      if (location.pathname === "/dashboard") {
        showDashboard();
      } else {
        showLogin();
      }
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
