import { describe, expect, it } from "vitest";

import type { PostSummary } from "../../model/post";
import { findAdjacentPosts } from "../findAdjacentPosts";

const post = (slug: string): PostSummary => ({
	title: slug,
	description: "desc",
	slug,
	date: "2026-01-01",
	private: false,
	tags: [],
	thumbnail: null,
	series: null,
	seriesOrder: null,
	readingTimeMinutes: 1
});

describe("findAdjacentPosts", () => {
	it("중간 포스트는 prev(과거)와 next(미래)를 모두 반환한다", () => {
		const posts = [post("newest"), post("middle"), post("oldest")];
		expect(findAdjacentPosts(posts, "middle")).toEqual({ prev: posts[2], next: posts[0] });
	});

	it("첫 포스트(가장 최신)는 next가 null이다", () => {
		const posts = [post("newest"), post("middle"), post("oldest")];
		expect(findAdjacentPosts(posts, "newest")).toEqual({ prev: posts[1], next: null });
	});

	it("마지막 포스트(가장 오래된)는 prev가 null이다", () => {
		const posts = [post("newest"), post("middle"), post("oldest")];
		expect(findAdjacentPosts(posts, "oldest")).toEqual({ prev: null, next: posts[1] });
	});

	it("일치 slug가 없으면 양쪽 모두 null", () => {
		const posts = [post("a"), post("b")];
		expect(findAdjacentPosts(posts, "missing")).toEqual({ prev: null, next: null });
	});

	it("단일 포스트는 양쪽 모두 null", () => {
		const posts = [post("only")];
		expect(findAdjacentPosts(posts, "only")).toEqual({ prev: null, next: null });
	});

	it("빈 입력에는 양쪽 모두 null", () => {
		expect(findAdjacentPosts([], "anything")).toEqual({ prev: null, next: null });
	});
});
