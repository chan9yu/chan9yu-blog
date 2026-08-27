import { describe, expect, it } from "vitest";

import { calculateReadingTime } from "../calculateReadingTime";

describe("calculateReadingTime", () => {
	it("500자 → 1분", () => {
		const text = "가".repeat(500);
		expect(calculateReadingTime(text)).toBe(1);
	});

	it("501자 → 2분 (ceil)", () => {
		const text = "가".repeat(501);
		expect(calculateReadingTime(text)).toBe(2);
	});

	it("최소 1분 (빈 문자열과 짧은 텍스트)", () => {
		expect(calculateReadingTime("")).toBe(1);
		expect(calculateReadingTime("안녕")).toBe(1);
	});

	it("코드 블록 제외", () => {
		const withCode = "가".repeat(400) + "\n```ts\n" + "나".repeat(1000) + "\n```\n";
		const withoutCode = "가".repeat(400);
		expect(calculateReadingTime(withCode)).toBe(calculateReadingTime(withoutCode));
	});

	it("이미지 태그 제외", () => {
		const withImage = "가".repeat(400) + "![대체텍스트](image.png)";
		const withoutImage = "가".repeat(400);
		expect(calculateReadingTime(withImage)).toBe(calculateReadingTime(withoutImage));
	});
});
