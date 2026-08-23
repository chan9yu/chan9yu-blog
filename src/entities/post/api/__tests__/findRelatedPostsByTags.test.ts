import { describe, expect, it } from "vitest";

import type { PostSummary } from "../../model/post";
import { findRelatedPostsByTags } from "../findRelatedPostsByTags";

const post = (slug: string, tags: string[]): PostSummary => ({
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

describe("findRelatedPostsByTags", () => {
	it("태그 겹침 수(overlapScore)가 높은 순으로 정렬한다", () => {
		const target = post("target", ["react", "typescript"]);
		const posts = [target, post("a", ["react"]), post("b", ["react", "typescript"]), post("c", ["typescript"])];
		const result = findRelatedPostsByTags(posts, target);
		expect(result.map((p) => p.slug)).toEqual(["b", "a", "c"]);
		expect(result[0]?.overlapScore).toBe(2);
		expect(result[1]?.overlapScore).toBe(1);
	});

	it("target 본인은 결과에서 제외한다", () => {
		const target = post("target", ["react"]);
		const posts = [target, post("a", ["react"])];
		const result = findRelatedPostsByTags(posts, target);
		expect(result.map((p) => p.slug)).toEqual(["a"]);
	});

	it("overlap이 0인 포스트는 제외한다", () => {
		const target = post("target", ["react"]);
		const posts = [target, post("unrelated", ["vue"])];
		expect(findRelatedPostsByTags(posts, target)).toEqual([]);
	});

	it("기본 limit은 3이다", () => {
		const target = post("target", ["react"]);
		const posts = [target, ...Array.from({ length: 5 }, (_, i) => post(`p${i}`, ["react"]))];
		expect(findRelatedPostsByTags(posts, target)).toHaveLength(3);
	});

	it("custom limit을 적용한다", () => {
		const target = post("target", ["react"]);
		const posts = [target, post("a", ["react"]), post("b", ["react"])];
		expect(findRelatedPostsByTags(posts, target, 1)).toHaveLength(1);
	});

	it("target에 태그가 없으면 빈 배열을 반환한다", () => {
		const target = post("target", []);
		const posts = [target, post("a", ["react"])];
		expect(findRelatedPostsByTags(posts, target)).toEqual([]);
	});

	it("동률 시 입력 순서(date desc 가정)를 보존한다", () => {
		const target = post("target", ["react"]);
		const posts = [target, post("newer", ["react"]), post("older", ["react"])];
		const result = findRelatedPostsByTags(posts, target);
		expect(result.map((p) => p.slug)).toEqual(["newer", "older"]);
	});

	it("빈 입력에는 빈 배열을 반환한다", () => {
		const target = post("target", ["react"]);
		expect(findRelatedPostsByTags([], target)).toEqual([]);
	});
});
