import { defineConfig } from "@playwright/test";

import { env } from "./framework/config/env";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["allure-playwright"]
  ],
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: env.BASE_URL,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure"
  },
  webServer: {
    command: "npm run app:serve",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
    url: env.BASE_URL
  }
});
