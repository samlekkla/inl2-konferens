// @ts-check
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { test, expect } = require("@playwright/test");

const page_url = pathToFileURL(path.join(__dirname, "..", "index.html")).href;

// Fyra vanliga bredder + 200 % och 300 % zoom på en 1440 px-skärm.
// Zoom i webbläsaren gör CSS-viewporten mindre: 1440 / 2 = 720, 1440 / 3 = 480.
const viewports = [
  { name: "320", width: 320, height: 800 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1440-zoom-200", width: 720, height: 450 },
  { name: "1440-zoom-300", width: 480, height: 300 },
];

const themes = ["dark", "light"];

for (const theme of themes) {
  for (const viewport of viewports) {
    test(`ingen horisontell scroll – ${theme} – ${viewport.name}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(page_url);

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      await page.screenshot({
        path: path.join(__dirname, "screenshots", `${theme}-${viewport.name}.png`),
        fullPage: true,
      });

      expect(scrollWidth, "sidan är bredare än fönstret").toBeLessThanOrEqual(clientWidth);
    });
  }
}
