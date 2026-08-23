import { describe, expect, it } from "vitest";

import { formatLocalizedSlug } from "../formatLocalizedSlug";

describe("formatLocalizedSlug", () => {
	it("한글 포함 slug는 hyphen을 공백으로 역변환한다", () => {
		expect(formatLocalizedSlug("WebRTC-박살내기")).toBe("WebRTC 박살내기");
		expect(formatLocalizedSlug("항해-플러스-프론트엔드-6기")).toBe("항해 플러스 프론트엔드 6기");
	});

	it("영문 전용 slug는 hyphen을 보존한다 (kebab-case 의도)", () => {
		expect(formatLocalizedSlug("react-19")).toBe("react-19");
		expect(formatLocalizedSlug("hanghae-plus-frontend-6th")).toBe("hanghae-plus-frontend-6th");
	});

	it("hyphen 없는 한글 slug는 그대로 반환한다", () => {
		expect(formatLocalizedSlug("회고")).toBe("회고");
		expect(formatLocalizedSlug("항해99")).toBe("항해99");
	});

	it("빈 문자열 입력은 그대로 반환한다", () => {
		expect(formatLocalizedSlug("")).toBe("");
	});
});
