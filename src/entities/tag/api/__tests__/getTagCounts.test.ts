import { describe, expect, it } from "vitest";

import { getTagCounts } from "../getTagCounts";
import { getTrendingTags } from "../getTrendingTags";

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

describe("getTagCounts", () => {
	it("count 내림차순으로 정렬한다", () => {
		const posts = [post("a", ["react"]), post("b", ["react", "tdd"]), post("c", ["react"])];
		const result = getTagCounts(posts);
		expect(result[0]).toEqual({ tag: "react", slug: "react", count: 3 });
		expect(result[1]).toEqual({ tag: "tdd", slug: "tdd", count: 1 });
	});

	it("count 동률은 tag 알파벳 오름차순으로 정렬한다", () => {
		const posts = [post("a", ["zebra", "alpha"])];
		const result = getTagCounts(posts);
		expect(result.map((t) => t.tag)).toEqual(["alpha", "zebra"]);
	});
});

describe("getTrendingTags", () => {
	it("지정한 limit 개수만큼 count 상위 태그를 반환한다", () => {
		const posts = [post("a", ["react"]), post("b", ["react", "tdd"]), post("c", ["react"]), post("d", ["typescript"])];
		const result = getTrendingTags(posts, 2);
		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({ tag: "react", slug: "react", count: 3 });
	});
});
