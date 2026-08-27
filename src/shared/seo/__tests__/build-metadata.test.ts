import { describe, expect, it } from "vitest";

import { siteMetadata } from "@/shared/config/site";

import { buildMetadata, NOT_FOUND_METADATA } from "../build-metadata";

type AnyRecord = Record<string, unknown>;

describe("buildMetadata", () => {
	it("title/description/canonical을 표준 Metadata 형태로 매핑한다", () => {
		const meta = buildMetadata({
			title: "포스트",
			description: "포스트 목록",
			path: "/posts"
		});

		expect(meta.title).toBe("포스트");
		expect(meta.description).toBe("포스트 목록");
		expect(meta.alternates?.canonical).toBe("/posts");
	});

	it("alternates에 RSS 자동 발견 링크를 항상 함께 낸다", () => {
		const meta = buildMetadata({
			title: "포스트",
			description: "포스트 목록",
			path: "/posts"
		});

		expect(meta.alternates?.types).toEqual({ "application/rss+xml": "/rss" });
	});

	it("openGraph에 type=website 기본값과 path 기반 url을 설정한다", () => {
		const meta = buildMetadata({
			title: "포스트",
			description: "포스트 목록",
			path: "/posts"
		});

		const og = meta.openGraph as AnyRecord | undefined;
		expect(og?.type).toBe("website");
		expect(og?.url).toBe("/posts");
		expect(og?.title).toBe("포스트");
		expect(og?.description).toBe("포스트 목록");
	});

	it("openGraph에 siteName과 locale을 항상 낸다 (루트 값이 덮이지 않도록)", () => {
		const website = buildMetadata({
			title: "포스트",
			description: "포스트 목록",
			path: "/posts"
		});
		const article = buildMetadata({
			title: "글",
			description: "글 본문",
			path: "/posts/x",
			type: "article",
			publishedAt: "2026-04-13"
		});

		for (const meta of [website, article]) {
			const og = meta.openGraph as AnyRecord | undefined;
			expect(og?.siteName).toBe(siteMetadata.name);
			expect(og?.locale).toBe(siteMetadata.locale);
		}
	});

	it("twitter card는 summary_large_image로 고정하고 이미지에 alt를 붙인다", () => {
		const meta = buildMetadata({
			title: "포스트",
			description: "포스트 목록",
			path: "/posts"
		});

		const tw = meta.twitter as AnyRecord | undefined;
		expect(tw?.card).toBe("summary_large_image");
		expect(tw?.title).toBe("포스트");
		expect(tw?.description).toBe("포스트 목록");

		const twImage = Array.isArray(meta.twitter?.images) ? meta.twitter.images[0] : meta.twitter?.images;
		expect(twImage).toEqual({ url: "/og?title=%ED%8F%AC%EC%8A%A4%ED%8A%B8", alt: "포스트" });
	});

	it("image 미지정 시 /og?title=... URL과 1200x630 치수를 함께 낸다", () => {
		const meta = buildMetadata({
			title: "React 19 use 훅",
			description: "...",
			path: "/posts/react-19-use"
		});

		const ogImage = Array.isArray(meta.openGraph?.images) ? meta.openGraph.images[0] : meta.openGraph?.images;
		expect(ogImage).toEqual({
			url: "/og?title=React%2019%20use%20%ED%9B%85",
			width: 1200,
			height: 630,
			alt: "React 19 use 훅"
		});
	});

	it("image를 명시하면 그대로 쓰고 치수는 선언하지 않는다 (실제 크기가 제각각이라)", () => {
		const meta = buildMetadata({
			title: "포스트",
			description: "포스트",
			path: "/posts/x",
			image: "/posts/x/images/thumbnail.png"
		});

		const ogImage = Array.isArray(meta.openGraph?.images) ? meta.openGraph.images[0] : meta.openGraph?.images;
		const twImage = Array.isArray(meta.twitter?.images) ? meta.twitter.images[0] : meta.twitter?.images;

		expect(ogImage).toEqual({ url: "/posts/x/images/thumbnail.png", alt: "포스트" });
		expect(twImage).toEqual({ url: "/posts/x/images/thumbnail.png", alt: "포스트" });
	});

	it("type=article이면 publishedTime을 설정하고 modifiedAt이 없으면 modifiedTime도 같은 값으로 낸다", () => {
		const meta = buildMetadata({
			title: "포스트",
			description: "포스트",
			path: "/posts/x",
			type: "article",
			publishedAt: "2026-04-13"
		});

		const og = meta.openGraph as { type?: string; publishedTime?: string; modifiedTime?: string } | undefined;
		expect(og?.type).toBe("article");
		expect(og?.publishedTime).toBe("2026-04-13");
		expect(og?.modifiedTime).toBe("2026-04-13");
	});

	it("modifiedAt이 있으면 그 값을 modifiedTime으로 낸다", () => {
		const meta = buildMetadata({
			title: "포스트",
			description: "포스트",
			path: "/posts/x",
			type: "article",
			publishedAt: "2026-04-13",
			modifiedAt: "2026-04-15"
		});

		const og = meta.openGraph as { modifiedTime?: string } | undefined;
		expect(og?.modifiedTime).toBe("2026-04-15");
	});

	it("noIndex=true면 robots에 noindex/nofollow를 설정한다", () => {
		const meta = buildMetadata({
			title: "비공개",
			description: "비공개 글",
			path: "/posts/private-x",
			noIndex: true
		});

		expect(meta.robots).toEqual({ index: false, follow: false });
	});
});

describe("NOT_FOUND_METADATA", () => {
	it("canonical과 openGraph, twitter를 null로 두어 홈 값 상속을 끊는다", () => {
		expect(NOT_FOUND_METADATA.alternates).toEqual({ canonical: null });
		expect(NOT_FOUND_METADATA.openGraph).toBeNull();
		expect(NOT_FOUND_METADATA.twitter).toBeNull();
	});
});
