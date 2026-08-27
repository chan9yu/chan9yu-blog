import { describe, expect, it } from "vitest";

import type { PostSummary } from "@/entities/post";

import { buildRssFeed } from "../rss-feed";

const BASE = "https://chan9yu.dev";

const FIRST_POST: PostSummary = {
	slug: "react-19-use",
	title: "React 19 use 훅",
	description: "use() 훅 동작 원리",
	date: "2026-04-13",
	private: false,
	tags: ["react", "react-19"],
	thumbnail: null,
	series: null,
	seriesOrder: null,
	readingTimeMinutes: 5
};

const SECOND_POST: PostSummary = {
	slug: "next-16-app-router",
	title: "Next 16 App Router",
	description: "App Router 심화",
	date: "2026-04-10",
	private: false,
	tags: ["next"],
	thumbnail: null,
	series: null,
	seriesOrder: null,
	readingTimeMinutes: 7
};

const SAMPLE_POSTS: PostSummary[] = [FIRST_POST, SECOND_POST];

describe("buildRssFeed", () => {
	it("RSS 2.0 표준 헤더와 채널 메타를 생성한다", () => {
		const xml = buildRssFeed({
			siteUrl: BASE,
			siteTitle: "chan9yu",
			siteDescription: "개발 블로그",
			authorName: "chan9yu",
			locale: "ko_KR",
			posts: []
		});

		expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
		expect(xml).toContain('<rss version="2.0"');
		expect(xml).toContain('xmlns:dc="http://purl.org/dc/elements/1.1/"');
		expect(xml).toContain("<channel>");
		expect(xml).toContain("<title>chan9yu</title>");
		expect(xml).toContain(`<link>${BASE}</link>`);
		expect(xml).toContain("<description>개발 블로그</description>");
		expect(xml).toContain("<language>ko-KR</language>");
		expect(xml).toContain(`<atom:link href="${BASE}/rss"`);
	});

	it("각 포스트는 item 블록(title/link/guid/description/pubDate/dc:creator/category)을 갖는다", () => {
		const xml = buildRssFeed({
			siteUrl: BASE,
			siteTitle: "chan9yu",
			siteDescription: "...",
			authorName: "chan9yu",
			locale: "ko_KR",
			posts: SAMPLE_POSTS
		});

		expect(xml).toContain("<title>React 19 use 훅</title>");
		expect(xml).toContain(`<link>${BASE}/posts/react-19-use</link>`);
		expect(xml).toContain(`<guid isPermaLink="true">${BASE}/posts/react-19-use</guid>`);
		expect(xml).toContain("<description>use() 훅 동작 원리</description>");
		expect(xml).toContain("<dc:creator>chan9yu</dc:creator>");
		expect(xml).not.toContain("<author>");
		expect(xml).toContain("<category>react</category>");
		expect(xml).toContain("<category>react-19</category>");
	});

	it("pubDate를 RFC 822 형식으로 직렬화한다", () => {
		const xml = buildRssFeed({
			siteUrl: BASE,
			siteTitle: "chan9yu",
			siteDescription: "...",
			authorName: "chan9yu",
			locale: "ko_KR",
			posts: [FIRST_POST]
		});

		const expected = new Date("2026-04-13").toUTCString();
		expect(xml).toContain(`<pubDate>${expected}</pubDate>`);
	});

	it("XML 특수문자 (&, <, >, \", ')를 이스케이프한다", () => {
		const xml = buildRssFeed({
			siteUrl: BASE,
			siteTitle: "chan9yu",
			siteDescription: "...",
			authorName: "chan9yu",
			locale: "ko_KR",
			posts: [
				{
					...FIRST_POST,
					title: "A & B <c> \"d\" 'e'",
					description: "1 < 2 & 3"
				}
			]
		});

		expect(xml).toContain("<title>A &amp; B &lt;c&gt; &quot;d&quot; &apos;e&apos;</title>");
		expect(xml).toContain("<description>1 &lt; 2 &amp; 3</description>");
	});

	it("최대 50개로 잘라낸다 (private 제외는 호출자 책임)", () => {
		const many: PostSummary[] = Array.from({ length: 100 }, (_, i) => ({
			...FIRST_POST,
			slug: `post-${i}`,
			title: `Post ${i}`,
			date: "2026-01-01"
		}));

		const xml = buildRssFeed({
			siteUrl: BASE,
			siteTitle: "chan9yu",
			siteDescription: "...",
			authorName: "chan9yu",
			locale: "ko_KR",
			posts: many
		});

		const itemCount = (xml.match(/<item>/g) ?? []).length;
		expect(itemCount).toBe(50);
	});

	it("lastBuildDate는 실린 글들의 updated와 date 중 가장 최근 값이다", () => {
		const xml = buildRssFeed({
			siteUrl: BASE,
			siteTitle: "chan9yu",
			siteDescription: "...",
			authorName: "chan9yu",
			locale: "ko_KR",
			posts: [FIRST_POST, { ...SECOND_POST, updated: "2026-05-01" }]
		});

		const expected = new Date("2026-05-01").toUTCString();
		expect(xml).toContain(`<lastBuildDate>${expected}</lastBuildDate>`);
	});
});
