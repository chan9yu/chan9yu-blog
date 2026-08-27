import { expect, test } from "@playwright/test";

import { gotoAndWaitForHydration, HYDRATION_TIMEOUT_MS } from "./helpers";

test.describe("M7-02 Cmd+K 검색 스모크", () => {
	test("검색 단축키로 검색 모달이 열리고 결과 클릭 시 상세로 이동한다", async ({ page }) => {
		await gotoAndWaitForHydration(page, "/");

		await page.keyboard.press("ControlOrMeta+k");

		const dialog = page.getByRole("dialog");
		await expect(dialog).toBeVisible({ timeout: HYDRATION_TIMEOUT_MS });

		await dialog.getByLabel("검색어").fill("react");

		const firstResult = dialog.getByRole("list", { name: "검색 결과" }).getByRole("link").first();
		const href = await firstResult.getAttribute("href");
		await firstResult.click();

		await expect(page).toHaveURL(href ?? /\/posts\//);
	});
});
