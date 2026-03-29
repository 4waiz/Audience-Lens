import { expect, test } from "@playwright/test";

test("homepage delivers the core product loop", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Speak once\. Meet people where they are\./i }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: /What was said/i }),
  ).toContainText(/Ravi Nair: The event pipeline is deduping late webhook fan-out/i);

  await page.getByRole("radio", { name: /Executive/i }).click();
  await expect(
    page.getByText(/There is one remaining billing risk during rapid reconnects/i),
  ).toBeVisible();

  await page.getByRole("button", { name: /Generate recap|Refresh recap/i }).click();
  await expect(
    page.getByText(/There is one contained billing risk during fast reconnects/i),
  ).toBeVisible();

  await page.getByRole("button", { name: /Status update/i }).click();
  await expect(
    page.getByRole("textbox", { name: /What was said/i }),
  ).toContainText(/Samir Khan: The ingestion worker caught up overnight/i);
});
