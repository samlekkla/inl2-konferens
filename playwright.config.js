// @ts-check
const { defineConfig, devices } = require("@playwright/test");

// Testerna öppnar index.html direkt från disk – ingen server behövs.
module.exports = defineConfig({
  testDir: "./tests",
  outputDir: "./test-results",
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
  },
});
