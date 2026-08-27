import { expect, test } from "@playwright/test";

import { gotoAndWaitForHydration } from "./helpers";

test("글 상세의 보조 영역이 스크린 리더 랜드마크 목록에서 서로 구분된다", async ({ page }) => {
	await gotoAndWaitForHydration(page, "/posts");
	const firstPost = page.locator('main a[href^="/posts/"]').first();
	await Promise.all([page.waitForURL(/\/posts\/[\w-]+/, { timeout: 10_000 }), firstPost.click()]);

	const landmarks = await page.evaluate(() => {
		const accessibleName = (el: Element) => {
			const label = el.getAttribute("aria-label");
			if (label) return label;
			const labelledby = el.getAttribute("aria-labelledby");
			if (!labelledby) return null;
			return (
				labelledby
					.split(/\s+/)
					.map((id) => document.getElementById(id)?.textContent?.trim())
					.filter(Boolean)
					.join(" ") || null
			);
		};
		return [...document.querySelectorAll("aside:not([role]), [role='complementary'], nav, [role='navigation']")]
			.filter((el) => el.getBoundingClientRect().height > 0)
			.map((el) => ({ role: el.tagName.toLowerCase(), name: accessibleName(el) }));
	});

	const complementary = landmarks.filter((item) => item.role === "aside");
	const unnamed = complementary.filter((item) => !item.name);
	expect(unnamed, "이름 없는 보조 영역이 여럿이면 목차와 시리즈 안내를 구분할 수 없다").toEqual([]);

	const names = landmarks.map((item) => item.name);
	expect(names, "목차가 랜드마크로 노출되어야 건너뛸 수 있다").toContain("목차");
});
