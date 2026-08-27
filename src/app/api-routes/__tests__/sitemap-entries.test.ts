import { describe, expect, it } from "vitest";

import { buildSitemapEntries } from "../sitemap-entries";

const BASE = "https://chan9yu.dev";

const SAMPLE_PUBLIC_POSTS = [
	{
		slug: "react-19-use",
		title: "React 19 use",
		description: "...",
		date: "2026-04-13",
		updated: "2026-05-01",
		private: false,
		tags: ["react", "next"],
		thumbnail: null,
		series: null,
		seriesOrder: null,
		readingTimeMinutes: 5
	},
	{
		slug: "next-16-app-router",
		title: "Next 16",
		description: "...",
		date: "2026-04-10",
		private: false,
		tags: ["react"],
		thumbnail: null,
		series: null,
		seriesOrder: null,
		readingTimeMinutes: 4
	}
];

const SAMPLE_SERIES = [
	{
		name: "React 19 Deep Dive",
		slug: "react-19-deep-dive",
		posts: SAMPLE_PUBLIC_POSTS
	}
];

const LATEST_ISO = new Date("2026-05-01").toISOString();

describe("buildSitemapEntries", () => {
	it("정적 경로 5개를 생성한다", () => {
		const entries = buildSitemapEntries({
			siteUrl: BASE,
			publicPosts: [],
			series: []
		});

		expect(entries.map((e) => e.url).sort()).toEqual(
			[`${BASE}/`, `${BASE}/posts`, `${BASE}/series`, `${BASE}/tags`, `${BASE}/about`].sort()
		);
	});

	it("/와 /posts, /series, /tags는 공개 글 전체의 최신 수정일을 쓰고 /about은 lastModified가 없다", () => {
		const entries = buildSitemapEntries({
			siteUrl: BASE,
			publicPosts: SAMPLE_PUBLIC_POSTS,
			series: []
		});

		const byUrl = new Map(entries.map((e) => [e.url, e]));

		for (const path of ["/", "/posts", "/series", "/tags"]) {
			expect((byUrl.get(`${BASE}${path}`)?.lastModified as Date).toISOString()).toBe(LATEST_ISO);
		}
		expect(byUrl.get(`${BASE}/about`)).not.toHaveProperty("lastModified");
	});

	it("포스트 lastModified는 updated가 있으면 updated, 없으면 date다", () => {
		const entries = buildSitemapEntries({
			siteUrl: BASE,
			publicPosts: SAMPLE_PUBLIC_POSTS,
			series: []
		});

		const updatedPost = entries.find((e) => e.url === `${BASE}/posts/react-19-use`);
		const datedPost = entries.find((e) => e.url === `${BASE}/posts/next-16-app-router`);

		expect((updatedPost?.lastModified as Date).toISOString()).toBe(LATEST_ISO);
		expect((datedPost?.lastModified as Date).toISOString()).toBe(new Date("2026-04-10").toISOString());
	});

	it("시리즈 lastModified는 그 시리즈 글들의 최신 수정일이다", () => {
		const entries = buildSitemapEntries({
			siteUrl: BASE,
			publicPosts: [],
			series: SAMPLE_SERIES
		});

		const series = entries.find((e) => e.url === `${BASE}/series/react-19-deep-dive`);
		expect((series?.lastModified as Date).toISOString()).toBe(LATEST_ISO);
	});

	it("태그 lastModified는 그 태그 글들의 최신 수정일이다", () => {
		const entries = buildSitemapEntries({
			siteUrl: BASE,
			publicPosts: SAMPLE_PUBLIC_POSTS,
			series: []
		});

		const tag = entries.find((e) => e.url === `${BASE}/tags/react`);
		expect((tag?.lastModified as Date).toISOString()).toBe(LATEST_ISO);
	});

	it("글이 한 편뿐인 태그는 noindex 대상이므로 사이트맵에서 뺀다", () => {
		const entries = buildSitemapEntries({
			siteUrl: BASE,
			publicPosts: SAMPLE_PUBLIC_POSTS,
			series: []
		});

		expect(entries.some((e) => e.url === `${BASE}/tags/react`)).toBe(true);
		expect(entries.some((e) => e.url === `${BASE}/tags/next`)).toBe(false);
	});

	it("태그 URL을 인코딩한다", () => {
		const koreanTagged = SAMPLE_PUBLIC_POSTS.map((post) => ({ ...post, tags: ["타입스크립트"] }));

		const entries = buildSitemapEntries({
			siteUrl: BASE,
			publicPosts: koreanTagged,
			series: []
		});

		expect(entries.some((e) => e.url === `${BASE}/tags/${encodeURIComponent("타입스크립트")}`)).toBe(true);
	});
});
