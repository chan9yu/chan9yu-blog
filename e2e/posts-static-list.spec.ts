import { expect, test } from "@playwright/test";

import { gotoAndWaitForHydration, HYDRATION_TIMEOUT_MS } from "./helpers";

const MIN_STATIC_POST_LINKS = 20;

test.describe("/posts 초기 HTML과 태그 필터", () => {
	test("자바스크립트를 돌리지 않고 받은 /posts HTML에 글 링크가 실린다 (useSearchParams가 목록을 통째로 CSR로 밀어내 스켈레톤만 남던 회귀. jsdom은 응답 HTML을 보지 못하므로 단위 테스트로 막을 수 없다)", async ({
		request
	}) => {
		const response = await request.get("/posts");
		expect(response.status()).toBe(200);

		const html = await response.text();
		const postLinks = new Set(Array.from(html.matchAll(/href="(\/posts\/[^"]+)"/g), (match) => match[1]));

		expect(html, "프리렌더가 클라이언트 렌더로 밀리면 이 마커가 남고 본문 자리에는 fallback만 실린다").not.toContain(
			"BAILOUT_TO_CLIENT_SIDE_RENDERING"
		);
		expect(
			postLinks.size,
			"자바스크립트를 실행하지 않는 크롤러에게는 이 HTML이 목록 페이지의 전부다"
		).toBeGreaterThanOrEqual(MIN_STATIC_POST_LINKS);
	});

	test("태그를 고르면 제자리에서 목록이 좁혀지고 뒤로가기로 전체가 돌아온다", async ({ page }) => {
		await gotoAndWaitForHydration(page, "/posts");

		const postLinks = page.locator('main a[href^="/posts/"]');
		await expect(postLinks.first()).toBeVisible({ timeout: HYDRATION_TIMEOUT_MS });
		const initialCount = await postLinks.count();

		const rail = page.getByRole("navigation", { name: "태그로 좁히기" });
		const allButton = rail.getByRole("button").first();
		const narrowestTag = rail.getByRole("button").last();

		const label = (await narrowestTag.textContent()) ?? "";
		const taggedCount = Number(/\((\d+)\)$/.exec(label.trim())?.[1]);
		expect(taggedCount).toBeGreaterThan(0);
		expect(taggedCount).toBeLessThan(initialCount);

		await narrowestTag.click();

		await expect(page).toHaveURL(/\/posts\?tag=/);
		await expect(postLinks).toHaveCount(taggedCount);
		await expect(narrowestTag).toHaveAttribute("aria-current", "page");

		await page.goBack();

		await expect(page).toHaveURL(/\/posts$/);
		await expect(allButton).toHaveAttribute("aria-current", "page");
		await expect.poll(() => postLinks.count()).toBeGreaterThan(taggedCount);
	});
});
