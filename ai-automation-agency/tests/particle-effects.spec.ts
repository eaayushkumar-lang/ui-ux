import { test, expect, type Page } from "@playwright/test";

// The intro overlay covers the page for its full duration; wait it out so
// the sections are settled before we scroll/sample.
const INTRO_SAFE_WAIT_MS = 4500;

const SECTIONS = [
  { id: "hero", formation: "rings" },
  { id: "system", formation: "spiral" },
  { id: "services", formation: "vortex" },
] as const;

/** Read a formation's live geometry checksum via the per-formation debug
 * hook the component installs on window. Reliable even when the sandbox's
 * software WebGL composites nothing to a screenshot. */
async function sample(page: Page, formation: string): Promise<number | null> {
  return page.evaluate((f) => {
    const key = `__particleSample_${f}`;
    const w = window as unknown as Record<string, undefined | (() => number)>;
    return w[key] ? w[key]!() : null;
  }, formation);
}

async function scrollIntoView(page: Page, id: string) {
  await page.evaluate((sectionId) => document.getElementById(sectionId)?.scrollIntoView(), id);
  await page.waitForTimeout(900); // let scrub/play-in settle
}

test.describe("section particle effects render", () => {
  for (const { id, formation } of SECTIONS) {
    test(`${formation} effect renders in #${id}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.goto("/");
      await page.waitForTimeout(INTRO_SAFE_WAIT_MS);

      await scrollIntoView(page, id);

      const canvas = page.getByTestId(`particle-field-${formation}`).locator("canvas");
      await expect(canvas).toHaveCount(1);
      await page.screenshot({ path: test.info().outputPath(`${formation}.png`) });

      const s = await sample(page, formation);
      expect(s, `${formation} debug sampler should be installed`).not.toBeNull();
    });
  }

  test("spiral assembles as the system section scrolls in", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await page.waitForTimeout(INTRO_SAFE_WAIT_MS);

    // At the very top the spiral is still scattered (pre-assembly).
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    const scattered = await sample(page, "spiral");

    await scrollIntoView(page, "system");
    const assembled = await sample(page, "spiral");

    expect(scattered).not.toBeNull();
    expect(assembled).not.toBeNull();
    // Assembly is a real per-particle move, so the radial checksum shifts
    // measurably between the scattered and condensed states.
    expect(Math.abs((assembled as number) - (scattered as number))).toBeGreaterThan(100);
  });

  test("vortex self-loops after its play-in", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await page.waitForTimeout(INTRO_SAFE_WAIT_MS);

    await scrollIntoView(page, "services");
    const a = await sample(page, "vortex");
    await page.waitForTimeout(400);
    const b = await sample(page, "vortex");

    expect(a).not.toBeNull();
    expect(b).not.toBeNull();
    // Particles are drifting inward every frame, so the buffer keeps
    // changing on its own (no further scroll needed).
    expect(a).not.toBe(b);
  });
});

test.describe("reduced motion renders static formations", () => {
  for (const { id, formation } of SECTIONS) {
    test(`${formation} is static under reduced motion`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/");
      await page.waitForTimeout(400); // intro is skipped under reduced motion

      await scrollIntoView(page, id);

      const canvas = page.getByTestId(`particle-field-${formation}`).locator("canvas");
      await expect(canvas).toHaveCount(1);

      const before = await sample(page, formation);
      expect(before, `${formation} debug sampler should be installed`).not.toBeNull();

      await page.waitForTimeout(500);
      await page.evaluate(() => window.scrollBy(0, 200));
      await page.waitForTimeout(400);
      const after = await sample(page, formation);

      // No rAF loop and no scroll-driven motion: the buffer is frozen.
      expect(after).toBe(before);
    });
  }
});
