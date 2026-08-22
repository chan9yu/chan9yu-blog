import { expect, test } from "@playwright/test";

test.describe("M7-04 테마 토글 영속성", () => {
	test("다크 모드 토글 후 새로고침해도 다크 모드가 유지된다", async ({ page }) => {
		await page.goto("/");

		const html = page.locator("html");

		const themeToggle = page.getByRole("button", { name: /테마|다크|라이트|theme|dark|light/i }).first();
		await expect(themeToggle).toBeVisible();

		const initialClass = (await html.getAttribute("class")) ?? "";
		const initiallyDark = initialClass.includes("dark");

		await themeToggle.click();

		await expect
			.poll(
				async () => {
					const cls = (await html.getAttribute("class")) ?? "";
					return cls.includes("dark") !== initiallyDark;
				},
				{ timeout: 2_000 }
			)
			.toBe(true);

		const afterToggleDark = !initiallyDark;

		await page.reload();

		await expect
			.poll(
				async () => {
					const cls = (await html.getAttribute("class")) ?? "";
					return cls.includes("dark");
				},
				{ timeout: 2_000 }
			)
			.toBe(afterToggleDark);
	});
});
