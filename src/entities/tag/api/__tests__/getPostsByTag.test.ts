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

	it("입력 순서(date desc 가정)를 그대로 보존한다", () => {
		const posts = [post("newer", ["react"]), post("older", ["react"])];
		const result = getPostsByTag(posts, "react");
		expect(result.map((p) => p.slug)).toEqual(["newer", "older"]);
	});

	it("일치하는 포스트가 없으면 빈 배열을 반환한다", () => {
		const posts = [post("a", ["react"])];
		expect(getPostsByTag(posts, "vue")).toEqual([]);
	});

	it("빈 입력에는 빈 배열을 반환한다", () => {
		expect(getPostsByTag([], "react")).toEqual([]);
	});

	it("대소문자를 구분한다 (정확 일치)", () => {
		const posts = [post("a", ["React"])];
		expect(getPostsByTag(posts, "react")).toEqual([]);
		expect(getPostsByTag(posts, "React").map((p) => p.slug)).toEqual(["a"]);
	});
});
