import { expect, test } from "@playwright/test";

import { gotoAndWaitForHydration } from "./helpers";

const LONG_ENOUGH_TO_NOTICE_MS = 100;

test("축소 모션에서 긴 전환이 사라지고 카드는 보인 채로 남는다", async ({ page }) => {
	await gotoAndWaitForHydration(page, "/posts");
	await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
	await page.reload({ waitUntil: "load" });
	await expect(page.locator("[data-card-reveal]").first()).toBeVisible();

	const state = await page.evaluate((thresholdMs) => {
		const moving: { cls: string; animation: string; transition: string }[] = [];
		for (const el of document.querySelectorAll("main *, header *")) {
			const style = getComputedStyle(el);
			const animationMs = (parseFloat(style.animationDuration) || 0) * 1000;
			const transitionMs = (parseFloat(style.transitionDuration) || 0) * 1000;
			if (animationMs > thresholdMs || transitionMs > thresholdMs) {
				moving.push({
					cls: String(el.className).slice(0, 40),
					animation: style.animationDuration,
					transition: style.transitionDuration
				});
			}
			if (moving.length >= 3) break;
		}
		const invisible = [...document.querySelectorAll("[data-card-reveal]")]
			.map((el) => getComputedStyle(el).opacity)
			.filter((opacity) => Number(opacity) < 0.99);
		return { moving, invisible };
	}, LONG_ENOUGH_TO_NOTICE_MS);

	expect(state.moving, "축소 모션에서도 눈에 띄는 전환이 남아 있다").toEqual([]);
	expect(state.invisible, "reveal이 꺼진 채 카드가 투명하게 남으면 글이 보이지 않는다").toEqual([]);
});
