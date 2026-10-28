import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  use: { baseURL: "http://localhost:3123" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run build && node tests/serve-out.mjs",
    url: "http://localhost:3123/ar/",
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
