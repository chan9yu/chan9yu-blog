import { describe, expect, it } from "vitest";

import { getAllTags } from "../getAllTags";

const post = (slug: string, tags: string[]) => ({
	title: slug,
	description: "desc",
	slug,
	date: "2026-01-01",
	private: false,
	tags,
	thumbnail: null,
	series: null,
	seriesOrder: null,
	readingTimeMinutes: 1
});

describe("getAllTags", () => {
	it("모든 unique 태그 slug를 알파벳 오름차순으로 반환한다", () => {
		const posts = [post("a", ["react", "tdd"]), post("b", ["typescript", "react"])];
		expect(getAllTags(posts)).toEqual(["react", "tdd", "typescript"]);
	});

	it("같은 태그가 여러 포스트에 있어도 한 번만 등장한다", () => {
		const posts = [post("a", ["react"]), post("b", ["react"]), post("c", ["react"])];
		expect(getAllTags(posts)).toEqual(["react"]);
	});

	it("태그가 없는 포스트만 있으면 빈 배열을 반환한다", () => {
		expect(getAllTags([post("a", [])])).toEqual([]);
	});

	it("빈 입력에는 빈 배열을 반환한다", () => {
		expect(getAllTags([])).toEqual([]);
	});
});
