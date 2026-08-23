import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

import { gotoAndWaitForHydration, HYDRATION_TIMEOUT_MS } from "./helpers";

type DialogA11yTarget = {
	describeTitle: string;
	triggerName: string;
	dialogName: string;
};

const BACKDROP_POINT = { x: 12, y: 200 };
const EXTRA_FORWARD_TABS = 2;
const REVERSE_TABS = 3;
const WHEEL_DELTA_PX = 400;
const WHEEL_SETTLE_FRAMES = 10;

async function expectFocusInside(dialog: Locator, step?: string) {
	const inside = await dialog.evaluate((el) => el.contains(document.activeElement));
	expect(inside, step).toBe(true);
}

async function waitForFrames(page: Page, frames: number) {
	await page.evaluate(
		(count) =>
			new Promise<void>((resolve) => {
				let remaining = count;
				const step = () => {
					remaining -= 1;
					if (remaining <= 0) {
						resolve();
						return;
					}
					requestAnimationFrame(step);
				};
				requestAnimationFrame(step);
			}),
		frames
	);
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

		test("modal 상태로 열려 aria-modal 의미를 가진다", async ({ page }) => {
			const { dialog } = await openDialog(page);

			const isModal = await dialog.evaluate((el) => el.matches(":modal"));
			expect(isModal).toBe(true);
		});

		test("ESC로 닫힌다", async ({ page }) => {
			const { dialog } = await openDialog(page);

			await page.keyboard.press("Escape");
			await expect(dialog).toBeHidden();
		});

		test("열린 동안 배경 스크롤이 잠긴다", async ({ page }) => {
			await page.mouse.wheel(0, WHEEL_DELTA_PX);
			await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
			await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));

			await openDialog(page);

			await page.mouse.wheel(0, WHEEL_DELTA_PX);
			await waitForFrames(page, WHEEL_SETTLE_FRAMES);
			const scrollYWhileOpen = await page.evaluate(() => window.scrollY);
			expect(scrollYWhileOpen).toBe(0);
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

		test("바깥을 클릭하면 닫힌다", async ({ page }) => {
			const { dialog } = await openDialog(page);

			await dialog.click({ position: BACKDROP_POINT });
			await expect(dialog).toBeHidden();
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
