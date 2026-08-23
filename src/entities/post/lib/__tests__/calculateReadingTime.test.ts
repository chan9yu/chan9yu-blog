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

	it("최소 1분 — 빈 문자열", () => {
		expect(calculateReadingTime("")).toBe(1);
	});

	it("최소 1분 — 짧은 텍스트", () => {
		expect(calculateReadingTime("안녕")).toBe(1);
	});

	it("코드 블록 제외", () => {
		const withCode = "가".repeat(400) + "\n```ts\n" + "나".repeat(1000) + "\n```\n";
		const withoutCode = "가".repeat(400);
		expect(calculateReadingTime(withCode)).toBe(calculateReadingTime(withoutCode));
	});

	it("인라인 수식 제외", () => {
		const withMath = "가".repeat(400) + "$y = mx + b$";
		const withoutMath = "가".repeat(400);
		expect(calculateReadingTime(withMath)).toBe(calculateReadingTime(withoutMath));
	});

	it("블록 수식 제외", () => {
		const withMath = "가".repeat(400) + "\n$$\ne = mc^2\n$$\n";
		const withoutMath = "가".repeat(400);
		expect(calculateReadingTime(withMath)).toBe(calculateReadingTime(withoutMath));
	});

	it("이미지 태그 제외", () => {
		const withImage = "가".repeat(400) + "![대체텍스트](image.png)";
		const withoutImage = "가".repeat(400);
		expect(calculateReadingTime(withImage)).toBe(calculateReadingTime(withoutImage));
	});

	it("포스트별 다른 값 — 긴 글이 더 오래 걸림", () => {
		const short = "가".repeat(300);
		const long = "가".repeat(1500);
		expect(calculateReadingTime(short)).toBeLessThan(calculateReadingTime(long));
	});
});
