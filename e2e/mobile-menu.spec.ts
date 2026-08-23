import { devices, expect, test } from "@playwright/test";

import { gotoAndWaitForHydration } from "./helpers";

test.use({ ...devices["Pixel 7"] });

test.describe("M7-05 모바일 Drawer", () => {
	test("모바일 viewport에서 햄버거 클릭 시 Sheet drawer가 열린다", async ({ page }) => {
		await gotoAndWaitForHydration(page, "/");

		const trigger = page.getByRole("button", { name: "메뉴 열기" });
		await expect(trigger).toBeVisible();

		await trigger.click();

		const drawer = page.getByRole("dialog", { name: "메뉴" });
		await expect(drawer).toBeVisible();

		const navLinks = drawer.getByRole("link");
		const linkCount = await navLinks.count();
		expect(linkCount).toBeGreaterThan(0);
	});
});
