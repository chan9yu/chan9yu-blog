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
	it("모든 태그 slug를 중복 없이 알파벳 오름차순으로 반환한다", () => {
		const posts = [post("a", ["react", "tdd"]), post("b", ["typescript", "react"])];
		expect(getAllTags(posts)).toEqual(["react", "tdd", "typescript"]);
	});
});
