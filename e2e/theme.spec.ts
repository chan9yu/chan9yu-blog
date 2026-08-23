import { expect, test } from "@playwright/test";

import { gotoAndWaitForHydration } from "./helpers";

test.describe("M7-04 테마 토글 영속성", () => {
	test("테마 토글 후 새로고침해도 바뀐 테마가 유지된다", async ({ page }) => {
		await gotoAndWaitForHydration(page, "/");

		const html = page.locator("html");

		const themeToggle = page.getByRole("button", { name: "라이트 모드로 변경" });
		await expect(themeToggle).toBeVisible();
		await expect(html).toHaveClass(/dark/);

		await themeToggle.click();
		await expect(html).not.toHaveClass(/dark/);

		await page.reload();
		await expect(html).not.toHaveClass(/dark/);
	});
});
