import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

import { gotoAndWaitForHydration, HYDRATION_TIMEOUT_MS } from "./helpers";

type DialogA11yTarget = {
	describeTitle: string;
	triggerName: string;
	dialogName: string;
};

const EXTRA_FORWARD_TABS = 2;
const REVERSE_TABS = 3;

async function expectFocusInside(dialog: Locator, step?: string) {
	const inside = await dialog.evaluate((el) => el.contains(document.activeElement));
	expect(inside, step).toBe(true);
}

export function defineDialogA11yTests({ describeTitle, triggerName, dialogName }: DialogA11yTarget) {
	test.describe(describeTitle, () => {
		test.beforeEach(async ({ page }) => {
			await gotoAndWaitForHydration(page, "/posts");
		});

		async function openDialog(page: Page) {
			const trigger = page.getByRole("button", { name: triggerName });
			await trigger.click();

			const dialog = page.getByRole("dialog", { name: dialogName });
			await expect(dialog).toBeVisible({ timeout: HYDRATION_TIMEOUT_MS });

			return { trigger, dialog };
		}

		test("Tab 순환이 대화상자 안에서만 돈다", async ({ page }) => {
			const { dialog } = await openDialog(page);

			const focusableCount = await dialog.evaluate(
				(el) => el.querySelectorAll("a[href], button, input, [tabindex]").length
			);
			expect(focusableCount).toBeGreaterThan(0);

			for (let i = 0; i < focusableCount + EXTRA_FORWARD_TABS; i += 1) {
				await page.keyboard.press("Tab");
				await expectFocusInside(dialog, `Tab ${i + 1}회 뒤 포커스가 대화상자 안에 있어야 한다`);
			}

			for (let i = 0; i < REVERSE_TABS; i += 1) {
				await page.keyboard.press("Shift+Tab");
				await expectFocusInside(dialog, `Shift+Tab ${i + 1}회 뒤 포커스가 대화상자 안에 있어야 한다`);
			}
		});

		test("닫으면 포커스가 연 버튼으로 돌아간다", async ({ page }) => {
			const { trigger, dialog } = await openDialog(page);

			await page.keyboard.press("Escape");
			await expect(dialog).toBeHidden();
			await expect(trigger).toBeFocused();
		});

		test("여는 동안 본문이 가로로 밀리지 않는다", async ({ page }) => {
			const main = page.locator("main");
			const boxBefore = await main.boundingBox();
			expect(boxBefore).not.toBeNull();

			await openDialog(page);

			const boxAfter = await main.boundingBox();
			expect(boxAfter).not.toBeNull();
			expect(boxAfter?.x).toBe(boxBefore?.x);
			expect(boxAfter?.width).toBe(boxBefore?.width);
		});

		test("열린 동안 배경 요소가 포커스를 받지 못한다", async ({ page }) => {
			const { trigger, dialog } = await openDialog(page);

			const backgroundFocused = await trigger.evaluate((el) => {
				el.focus();
				return document.activeElement === el;
			});
			expect(backgroundFocused).toBe(false);

			await expectFocusInside(dialog);
		});
	});
}
