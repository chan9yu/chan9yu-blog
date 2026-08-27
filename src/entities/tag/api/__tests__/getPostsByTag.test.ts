import { describe, expect, it } from "vitest";

import { getPostsByTag } from "../getPostsByTag";

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

describe("getPostsByTag", () => {
	it("태그를 포함한 포스트만 반환한다", () => {
		const posts = [post("a", ["react"]), post("b", ["typescript"]), post("c", ["react", "tdd"])];
		const result = getPostsByTag(posts, "react");
		expect(result.map((p) => p.slug)).toEqual(["a", "c"]);
	});
});
