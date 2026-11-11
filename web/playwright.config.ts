import { defineConfig } from "@playwright/test";

const PORT = 3100;

// Uses the locally installed Chrome (no browser download). Emulates an iPhone 13 viewport
// with touch; real WebKit checks happen in the iOS Simulator and on the founder's iPhone.
export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: `http://127.0.0.1:${PORT}`, trace: "retain-on-failure", locale: "fr-FR" },
  projects: [
    {
      name: "iphone-13-chrome",
      use: {
        browserName: "chromium",
        channel: "chrome",
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT} -H 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
