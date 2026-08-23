import { expect, test } from "@playwright/test";

import { gotoAndWaitForHydration } from "./helpers";

test.describe("M7-01 홈 → 포스트 상세 스모크", () => {
	test("홈 페이지에서 첫 포스트 카드 클릭 시 상세 페이지로 이동한다", async ({ page }) => {
		await gotoAndWaitForHydration(page, "/");

		const main = page.locator("main");
		const firstPostLink = main.locator('a[href^="/posts/"]').first();

		await expect(firstPostLink).toBeVisible();
		const href = await firstPostLink.getAttribute("href");
		expect(href).toMatch(/^\/posts\//);

		await Promise.all([page.waitForURL(/\/posts\/[\w-]+/, { timeout: 10_000 }), firstPostLink.click()]);

		await expect(page.locator("article")).toBeVisible();
		await expect(page.locator("article h1, article h2").first()).toBeVisible();
	});
});
