import { expect, test } from "@playwright/test";

test("l’accueil s’affiche en français, avec les polices de marque et sans erreur", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400) errors.push(`${r.status()} ${new URL(r.url()).pathname}`);
  });

  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  const title = page.getByRole("heading", { level: 1 });
  await expect(title).toHaveText("Tout retrouve sa place.");
  await page.evaluate(() => document.fonts.ready);
  const family = await title.evaluate((el) => getComputedStyle(el).fontFamily);
  expect(family).toMatch(/Bricolage/i);

  await page.screenshot({ path: testInfo.outputPath("accueil-390.png"), fullPage: true });
  expect(errors).toEqual([]);
});
