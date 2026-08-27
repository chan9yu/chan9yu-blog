import { describe, expect, it } from "vitest";

import { slugify } from "../slugify";

describe("slugify", () => {
	it("숫자 보존", () => {
		expect(slugify("React 19 Features")).toBe("react-19-features");
	});

	it("특수문자 제거 후 slug화", () => {
		expect(slugify("use() 훅 완벽이해")).toBe("use-훅-완벽이해");
	});

	it("연속 공백 → 개별 하이픈 (github-slugger 정합)", () => {
		expect(slugify("hello   world")).toBe("hello---world");
	});

	it("앞뒤 공백과 하이픈 제거", () => {
		expect(slugify("  hello  ")).toBe("hello");
		expect(slugify("  (hello)  ")).toBe("hello");
	});

	it("연속 하이픈 보존 (github-slugger 정합)", () => {
		expect(slugify("hello--world")).toBe("hello--world");
	});

	it("빈 문자열과 특수문자만 있는 경우 빈 문자열", () => {
		expect(slugify("")).toBe("");
		expect(slugify("!!!")).toBe("");
	});
});
