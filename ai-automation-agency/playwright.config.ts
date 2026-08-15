import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://localhost:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    // Use the environment's pre-installed full Chromium rather than
    // Playwright's default chrome-headless-shell (not downloaded here).
    // Falls back to Playwright's own resolution when the env var is unset,
    // so this stays correct on a normal machine / in CI.
    launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : undefined,
  },
  webServer: {
    command: "npm run preview -- --port 4173",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    // iPhone 13 defaults to WebKit; pin to Chromium (keeps phone viewport/UA/touch).
    { name: "mobile", use: { ...devices["iPhone 13"], browserName: "chromium", defaultBrowserType: "chromium" } },
    // Reduced-motion coverage is per-test via page.emulateMedia(), not a project.
  ],
});
