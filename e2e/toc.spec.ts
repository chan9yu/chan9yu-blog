import { expect, test } from "@playwright/test";

import { findPostWhere, loadAllArticleImages } from "./helpers";

test.describe("M7-03 TOC 클릭 스크롤", () => {
	test("목차 링크를 클릭하면 해당 heading으로 스크롤되고 URL hash가 anchor와 일치한다", async ({ page }) => {
		await findPostWhere(
			page,
			async (p) => (await p.getByRole("navigation", { name: "목차" }).getByRole("link").count()) > 0,
			"목차가 있는 글이 없다"
		);

		await loadAllArticleImages(page);

		const tocLinks = page.getByRole("navigation", { name: "목차" }).getByRole("link");

		const tocHrefs = await tocLinks.evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
		expect(tocHrefs.length).toBeGreaterThan(0);

		const headingIds = await page
			.locator("article :is(h2, h3, h4)[id]")
			.evaluateAll((headings) => headings.map((heading) => heading.id));
		expect(headingIds.length).toBeGreaterThan(0);

		for (const tocHref of tocHrefs) {
			expect(tocHref).toMatch(/^#./);
			expect(headingIds).toContain(tocHref.slice(1));
		}

		const targetLink = tocLinks.last();
		const href = await targetLink.getAttribute("href");
		expect(href).toMatch(/^#./);

		const headingId = (href ?? "").slice(1);
		const heading = page.locator(`article [id="${headingId}"]`);
		await expect(heading).not.toBeInViewport();

		await targetLink.click();

		await expect(heading).toBeInViewport({ ratio: 0.5 });
		await expect.poll(() => decodeURIComponent(new URL(page.url()).hash)).toBe(`#${headingId}`);
	});
});
