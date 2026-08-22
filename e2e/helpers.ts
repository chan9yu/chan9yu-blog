import type { Page } from "@playwright/test";

export async function waitForHydration(page: Page) {
	await page.locator('button[aria-label*="모드로 변경"] svg:not(.opacity-0)').first().waitFor({ state: "attached" });
}
