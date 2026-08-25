import { expect, test } from "@playwright/test";

import { gotoAndWaitForHydration } from "./helpers";

test("화면 조작용 고정 요소가 인쇄물에 남지 않는다", async ({ page }) => {
	await gotoAndWaitForHydration(page, "/posts");
	const firstPost = page.locator('main a[href^="/posts/"]').first();
	await Promise.all([page.waitForURL(/\/posts\/[\w-]+/, { timeout: 10_000 }), firstPost.click()]);

	await page.evaluate(() => window.scrollTo(0, 3000));
	await expect(page.getByRole("button", { name: "맨 위로 이동" })).toBeVisible();

	await page.emulateMedia({ media: "print" });

	const stuck = await page.evaluate(() =>
		[...document.querySelectorAll("body > *")]
			.filter((el) => {
				const style = getComputedStyle(el);
				const isPinned = style.position === "fixed" || style.position === "sticky";
				const isRendered =
					style.display !== "none" &&
					style.visibility !== "hidden" &&
					style.opacity !== "0" &&
					el.getBoundingClientRect().height > 0;
				return isPinned && isRendered;
			})
			.map((el) => (el.getAttribute("aria-label") || el.textContent || el.tagName).trim().slice(0, 24))
	);

	expect(stuck, "고정 요소는 인쇄에서 페이지마다 다시 그려져 본문을 끊는다").toEqual([]);

	await page.emulateMedia({ media: "screen" });
	await expect(
		page.getByRole("button", { name: "맨 위로 이동" }),
		"인쇄용으로 숨기다가 화면에서까지 사라지면 안 된다"
	).toBeVisible();
});
