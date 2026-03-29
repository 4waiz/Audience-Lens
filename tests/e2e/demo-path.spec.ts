import { expect, test } from "@playwright/test";

test("landing page routes into the sample demo workspace", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Speak once\. Meet people where they are\./i }),
  ).toBeVisible();

  await page.getByRole("link", { name: /Try sample demo/i }).first().click();

  await expect(page).toHaveURL(/\/app\/demo$/);
  await expect(page.getByRole("heading", { name: /Audience adaptation/i })).toBeVisible();
  await expect(page.getByText(/Live transcript/i)).toBeVisible();

  await page.getByText(/The event pipeline is deduping late webhook fan-out/i).click();
  await page.getByRole("tab", { name: /Audience mode/i }).click();
  await page.getByRole("radio", { name: /Executive/i }).click();
  await expect(
    page.getByText(/There is one remaining billing risk during rapid reconnects/i),
  ).toBeVisible();
});
