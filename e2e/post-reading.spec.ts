import { expect, test } from "@playwright/test";

import { findPostWhere, loadAllArticleImages } from "./helpers";

test.describe("M7-06 글 읽기 파이프라인", () => {
	test("코드 블록이 shiki 토큰으로 하이라이트되어 렌더된다", async ({ page }) => {
		await findPostWhere(
			page,
			async (p) => (await p.locator("article pre code").count()) > 0,
			"코드 블록이 있는 글이 없다"
		);

		const codeBlock = page.locator("article pre.shiki").first();
		await expect(codeBlock).toBeVisible();

		await expect(codeBlock.locator("code span[style]").first()).toBeAttached();

		const codeText = (await codeBlock.innerText()).trim();
		expect(codeText).not.toBe("");
	});

	test("본문 heading이 id를 갖고 목차 링크 href와 일치한다", async ({ page }) => {
		await findPostWhere(
			page,
			async (p) => (await p.getByRole("navigation", { name: "목차" }).getByRole("link").count()) > 0,
			"목차가 있는 글이 없다"
		);

		const tocHrefs = await page
			.getByRole("navigation", { name: "목차" })
			.getByRole("link")
			.evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
		expect(tocHrefs.length).toBeGreaterThan(0);

		const headingIds = await page
			.locator("article :is(h2, h3, h4)[id]")
			.evaluateAll((headings) => headings.map((heading) => heading.id));
		expect(headingIds.length).toBeGreaterThan(0);

		for (const tocHref of tocHrefs) {
			expect(tocHref).toMatch(/^#./);
			expect(headingIds).toContain(tocHref.slice(1));
		}
	});

	test("본문 이미지를 클릭하면 라이트박스 dialog가 열리고 Escape로 닫힌다", async ({ page }) => {
		const imageButtonName = /확대 보기/;
		await findPostWhere(
			page,
			async (p) => (await p.locator("article").getByRole("button", { name: imageButtonName }).count()) > 0,
			"본문 이미지가 있는 글이 없다"
		);

		await loadAllArticleImages(page);

		await page.locator("article").getByRole("button", { name: imageButtonName }).first().click();

		const lightbox = page.getByRole("dialog", { name: "이미지 확대" });
		await expect(lightbox).toBeVisible();
		await expect(lightbox.locator("img")).toBeVisible();

		await page.keyboard.press("Escape");
		await expect(lightbox).toBeHidden();
	});

	test("표가 있는 글에서 table이 헤더 행과 함께 렌더된다", async ({ page }) => {
		await findPostWhere(page, async (p) => (await p.locator("article table").count()) > 0, "표가 있는 글이 없다");

		const table = page.locator("article").getByRole("table").first();
		await expect(table).toBeVisible();
		await expect(table.getByRole("columnheader").first()).toBeVisible();
		await expect(table.getByRole("row").nth(1)).toBeVisible();
	});
});
