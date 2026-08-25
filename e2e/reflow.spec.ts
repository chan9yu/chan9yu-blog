import { expect, test } from "@playwright/test";

import { gotoAndWaitForHydration } from "./helpers";

const NARROW_VIEWPORT = { width: 320, height: 512 };

test.describe("400% 확대 리플로우", () => {
	test.use({ viewport: NARROW_VIEWPORT });

	test("표와 코드가 있는 글에서도 가로 스크롤이 생기지 않는다", async ({ page }) => {
		await gotoAndWaitForHydration(page, "/posts");
		const firstPost = page.locator('main a[href^="/posts/"]').first();
		await Promise.all([page.waitForURL(/\/posts\/[\w-]+/, { timeout: 10_000 }), firstPost.click()]);

		const size = await page.evaluate(() => ({
			scrollWidth: document.documentElement.scrollWidth,
			clientWidth: document.documentElement.clientWidth
		}));

		expect(
			size.scrollWidth,
			`320px 폭에서 가로 스크롤이 생기면 WCAG 1.4.10 위반이다 (${size.scrollWidth} > ${size.clientWidth})`
		).toBeLessThanOrEqual(size.clientWidth + 1);
	});
});
