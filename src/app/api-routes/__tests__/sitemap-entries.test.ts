import { describe, expect, it } from "vitest";

import { buildSitemapEntries } from "../sitemap-entries";

const BASE = "https://chan9yu.dev";

const SAMPLE_PUBLIC_POSTS = [
	{
		slug: "react-19-use",
		title: "React 19 use",
		description: "...",
		date: "2026-04-13",
		private: false,
		tags: ["react"],
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
		tags: ["next"],
		thumbnail: null,
		series: null,
		seriesOrder: null,
		readingTimeMinutes: 4
	}
];

const SAMPLE_TAGS = ["react", "next"];

const SAMPLE_SERIES = [
	{
		name: "React 19 Deep Dive",
		slug: "react-19-deep-dive",
		posts: SAMPLE_PUBLIC_POSTS
	}
];

describe("buildSitemapEntries", () => {
	it("정적 경로 5개를 priority/changefreq 표대로 생성한다", () => {
		const entries = buildSitemapEntries({
			siteUrl: BASE,
			publicPosts: [],
			tags: [],
			series: []
		});

		const byUrl = new Map(entries.map((e) => [e.url, e]));

		expect(byUrl.get(`${BASE}/`)).toMatchObject({ priority: 1.0, changeFrequency: "daily" });
		expect(byUrl.get(`${BASE}/posts`)).toMatchObject({ priority: 0.9, changeFrequency: "daily" });
		expect(byUrl.get(`${BASE}/series`)).toMatchObject({ priority: 0.7, changeFrequency: "weekly" });
		expect(byUrl.get(`${BASE}/tags`)).toMatchObject({ priority: 0.6, changeFrequency: "weekly" });
		expect(byUrl.get(`${BASE}/about`)).toMatchObject({ priority: 0.5, changeFrequency: "monthly" });
	});

	it("public 포스트마다 /posts/[slug] entry를 priority 0.8 weekly로 생성한다", () => {
		const entries = buildSitemapEntries({
			siteUrl: BASE,
			publicPosts: SAMPLE_PUBLIC_POSTS,
			tags: [],
			series: []
		});

		const post = entries.find((e) => e.url === `${BASE}/posts/react-19-use`);
		expect(post).toMatchObject({ priority: 0.8, changeFrequency: "weekly" });
		expect(post?.lastModified).toBeInstanceOf(Date);
	});

	it("태그마다 /tags/[tag] entry를 priority 0.5 weekly로 생성한다 (URL encode 포함)", () => {
		const entries = buildSitemapEntries({
			siteUrl: BASE,
			publicPosts: [],
			tags: ["react", "타입스크립트"],
			series: []
		});

		const ko = entries.find((e) => e.url === `${BASE}/tags/${encodeURIComponent("타입스크립트")}`);
		expect(ko).toMatchObject({ priority: 0.5, changeFrequency: "weekly" });
	});

	it("시리즈마다 /series/[slug] entry를 priority 0.6 weekly로 생성한다", () => {
		const entries = buildSitemapEntries({
			siteUrl: BASE,
			publicPosts: [],
			tags: [],
			series: SAMPLE_SERIES
		});

		const series = entries.find((e) => e.url === `${BASE}/series/react-19-deep-dive`);
		expect(series).toMatchObject({ priority: 0.6, changeFrequency: "weekly" });
	});

	it("포스트 lastModified는 frontmatter date 기반이다", () => {
		const entries = buildSitemapEntries({
			siteUrl: BASE,
			publicPosts: SAMPLE_PUBLIC_POSTS,
			tags: [],
			series: []
		});

		const post = entries.find((e) => e.url === `${BASE}/posts/react-19-use`);
		expect((post?.lastModified as Date).toISOString()).toBe(new Date("2026-04-13").toISOString());
	});

	it("호출자가 private 제외한 입력만 넘기면 sitemap에 private이 등장하지 않는다", () => {
		const entries = buildSitemapEntries({
			siteUrl: BASE,
			publicPosts: SAMPLE_PUBLIC_POSTS,
			tags: SAMPLE_TAGS,
			series: SAMPLE_SERIES
		});

		expect(entries.some((e) => e.url.includes("private"))).toBe(false);
	});
});
