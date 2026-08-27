/** @vitest-environment node */
import { describe, expect, it, vi } from "vitest";

import type { PostSummary } from "@/entities/post";

const makePost = (slug: string, isPrivate: boolean): PostSummary => ({
	title: `포스트 ${slug}`,
	description: `${slug} 설명입니다.`,
	slug,
	date: "2026-01-01",
	private: isPrivate,
	tags: [],
	thumbnail: null,
	series: null,
	seriesOrder: null,
	readingTimeMinutes: 1
});

const allPosts = [makePost("public-a", false), makePost("private-x", true)];

vi.mock("@/entities/post/index.server", () => ({
	getAllPosts: ({ includePrivate }: { includePrivate?: boolean } = {}) =>
		includePrivate ? allPosts : allPosts.filter((post) => !post.private),
	getPostDetail: () => null,
	getPublicPosts: () => allPosts.filter((post) => !post.private),
	resolveThumbnailSrc: () => null
}));

const { generateStaticParams } = await import("../PostDetailPage");

describe("포스트 상세 generateStaticParams", () => {
	it("private 글도 prerender 대상에 넣어 dynamicParams가 닫힌 뒤에도 직접 URL이 열리게 한다", () => {
		expect(generateStaticParams().map((param) => param.slug)).toEqual(["public-a", "private-x"]);
	});
});
