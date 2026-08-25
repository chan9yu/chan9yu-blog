import { expect, test } from "@playwright/test";

import { findPostWhere, gotoAndWaitForHydration } from "./helpers";

async function denyClipboard(page: import("@playwright/test").Page) {
	await page.addInitScript(() => {
		Object.defineProperty(navigator, "clipboard", {
			get: () => ({
				writeText: () => Promise.reject(new DOMException("denied", "NotAllowedError"))
			}),
			configurable: true
		});
	});
}

test.describe("코드 복사 실패 표시", () => {
	test("클립보드가 거부되면 버튼이 실패 상태로 바뀐다", async ({ page }) => {
		await denyClipboard(page);

		const path = await findPostWhere(
			page,
			async (target) => (await target.locator("pre").count()) > 0,
			"코드 블록이 있는 글이 없다"
		);
		await gotoAndWaitForHydration(page, path);

		const pre = page.locator("pre").first();
		await pre.scrollIntoViewIfNeeded();
		await pre.hover();

		const copyButton = page.locator("button[aria-label*='복사']").first();
		await expect(copyButton).toHaveAttribute("aria-label", "코드 복사");

		await copyButton.click();

		await expect(copyButton).toHaveAttribute("aria-label", "복사 실패");
		await expect(page.getByText("복사에 실패했습니다")).toBeAttached();

		const failedColor = await copyButton.evaluate((el) => getComputedStyle(el).color);
		const idleColor = await page
			.locator("button[aria-label='코드 복사']")
			.first()
			.evaluate((el) => getComputedStyle(el).color)
			.catch(() => null);
		expect(failedColor, "실패 상태가 평상시와 같은 색이면 눈으로 구분되지 않는다").not.toBe(idleColor);

		await expect(copyButton).toHaveAttribute("aria-label", "코드 복사", { timeout: 5_000 });
	});
});
