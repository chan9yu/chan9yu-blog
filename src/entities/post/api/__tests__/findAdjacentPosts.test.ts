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
	it("중간 포스트는 prev(과거)와 next(미래)를 모두 반환하고 양 끝은 한쪽이 null이다", () => {
		const posts = [post("newest"), post("middle"), post("oldest")];
		expect(findAdjacentPosts(posts, "middle")).toEqual({ prev: posts[2], next: posts[0] });
		expect(findAdjacentPosts(posts, "newest")).toEqual({ prev: posts[1], next: null });
		expect(findAdjacentPosts(posts, "oldest")).toEqual({ prev: null, next: posts[1] });
		expect(findAdjacentPosts([post("only")], "only")).toEqual({ prev: null, next: null });
	});

	it("일치 slug가 없거나 입력이 비면 양쪽 모두 null", () => {
		expect(findAdjacentPosts([post("a"), post("b")], "missing")).toEqual({ prev: null, next: null });
		expect(findAdjacentPosts([], "anything")).toEqual({ prev: null, next: null });
	});
});
