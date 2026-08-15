import { test, expect } from "@playwright/test";

// Generous upper bound on the intro's own total choreographed duration.
const INTRO_SAFE_WAIT_MS = 4500;

test.describe("intro sequence", () => {
  test("plays on first load and fully unmounts once resolved", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await expect(page.getByTestId("intro-overlay")).toBeVisible();
    await page.waitForTimeout(INTRO_SAFE_WAIT_MS);
    await expect(page.getByTestId("intro-overlay")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Contact Us" })).toBeVisible();
  });

  test("does not replay on reload within the same session", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await page.waitForTimeout(INTRO_SAFE_WAIT_MS);
    await expect(page.getByTestId("intro-overlay")).toHaveCount(0);
    await page.reload();
    await expect(page.getByRole("button", { name: "Contact Us" })).toBeVisible();
    await expect(page.getByTestId("intro-overlay")).toHaveCount(0);
  });

  test("prefers-reduced-motion skips the intro entirely", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Contact Us" })).toBeVisible();
    await expect(page.getByTestId("intro-overlay")).toHaveCount(0);
  });
});
