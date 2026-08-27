import { describe, expect, it } from "vitest";

import { loadPretendardFonts, PRETENDARD_FAMILY } from "../fonts";

describe("loadPretendardFonts", () => {
	it("Pretendard Regular(400)과 Bold(700) 2종을 Buffer로 로드한다", () => {
		const fonts = loadPretendardFonts();
		expect(fonts).toHaveLength(2);
		expect(fonts.map((f) => f.weight).sort()).toEqual([400, 700]);
		for (const font of fonts) {
			expect(font.name).toBe(PRETENDARD_FAMILY);
			expect(font.data.length).toBeGreaterThan(1000);
		}
	});
});
