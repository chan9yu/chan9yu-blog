import { expect, test } from "@playwright/test";

import { HYDRATION_TIMEOUT_MS } from "./helpers";

const MOBILE_VIEWPORT = { width: 390, height: 844 };
const CAPTURE_MS = 700;

type Frame = { t: number; x: number };

test.describe("모바일 서랍 등장 애니메이션", () => {
	test.use({ viewport: MOBILE_VIEWPORT });

	test("패널이 화면 밖에서 제자리로 미끄러져 들어온다", async ({ page }) => {
		await page.goto("/");
		await expect(page.getByRole("button", { name: "메뉴 열기" })).toBeVisible({ timeout: HYDRATION_TIMEOUT_MS });

		await page.evaluate(() => {
			(window as unknown as { __frames: Frame[] }).__frames = [];
		});

		await page.getByRole("button", { name: "메뉴 열기" }).click();

		await page.evaluate((captureMs) => {
			const frames = (window as unknown as { __frames: Frame[] }).__frames;
			const start = performance.now();
			const tick = () => {
				const panel = document.querySelector("dialog[open] > *");
				if (panel) {
					frames.push({ t: Math.round(performance.now() - start), x: Math.round(panel.getBoundingClientRect().x) });
				}
				if (performance.now() - start < captureMs) requestAnimationFrame(tick);
			};
			requestAnimationFrame(tick);
		}, CAPTURE_MS);

		await page.waitForTimeout(CAPTURE_MS + 300);

		const frames = await page.evaluate(() => (window as unknown as { __frames: Frame[] }).__frames);
		expect(frames.length, "프레임을 하나도 캡처하지 못했다").toBeGreaterThan(5);

		const positions = frames.map((frame) => frame.x);
		const distinct = new Set(positions);
		expect(
			distinct.size,
			`패널이 ${[...distinct].join(", ")} 한 자리에만 있으면 등장 애니메이션 없이 튀어나온 것이다`
		).toBeGreaterThan(2);

		const rightmost = Math.max(...positions);
		const settled = positions.at(-1) ?? rightmost;
		expect(rightmost, "패널이 처음부터 제자리에 있으면 밖에서 들어온 것이 아니다").toBeGreaterThan(settled);
		expect(settled, "멈춘 위치가 화면 안쪽이어야 한다").toBeLessThanOrEqual(MOBILE_VIEWPORT.width - 100);
	});
});
