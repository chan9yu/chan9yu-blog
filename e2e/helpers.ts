import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export const HYDRATION_TIMEOUT_MS = 15_000;

const POST_SCAN_LIMIT = 8;

export async function gotoAndWaitForHydration(page: Page, path: string) {
	await page.emulateMedia({ colorScheme: "dark" });
	await page.goto(path);

	const hydratedThemeToggle = page.getByRole("button", { name: "라이트 모드로 변경" });
	await expect(hydratedThemeToggle).toBeVisible({ timeout: HYDRATION_TIMEOUT_MS });
}

async function collectPostPaths(page: Page) {
	await page.goto("/posts");

	const postLinks = page.locator('main a[href^="/posts/"]');
	await expect(postLinks.first()).toBeVisible({ timeout: HYDRATION_TIMEOUT_MS });

	const hrefs = await postLinks.evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute("href")));
	const paths = hrefs.filter((href): href is string => typeof href === "string");

	return [...new Set(paths)].slice(0, POST_SCAN_LIMIT);
}

export async function loadAllArticleImages(page: Page) {
	await page.locator("article img").evaluateAll((elements) =>
		Promise.all(
			elements.map((element) => {
				if (!(element instanceof HTMLImageElement)) {
					return undefined;
				}

				element.loading = "eager";
				if (element.complete) {
					return undefined;
				}

				return new Promise((resolve) => {
					element.addEventListener("load", resolve, { once: true });
					element.addEventListener("error", resolve, { once: true });
				});
			})
		)
	);
}

export async function findPostWhere(page: Page, hasTarget: (page: Page) => Promise<boolean>, missing: string) {
	const paths = await collectPostPaths(page);

	for (const path of paths) {
		await gotoAndWaitForHydration(page, path);
		await expect(page.locator("article")).toBeVisible();

		if (await hasTarget(page)) {
			return path;
		}
	}

	throw new Error(`최신 ${paths.length}편 안에 ${missing}`);
}
