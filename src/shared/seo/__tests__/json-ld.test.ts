import { describe, expect, it } from "vitest";

import { buildBlogPostingJsonLd, buildBreadcrumbJsonLd, buildPersonJsonLd, buildWebSiteJsonLd } from "../json-ld";

const BASE = "https://chan9yu.dev";

describe("buildWebSiteJsonLd", () => {
	it("WebSite + Person author를 절대 URL로 직렬화한다", () => {
		const ld = buildWebSiteJsonLd({
			siteUrl: BASE,
			siteName: "chan9yu",
			description: "개발 블로그",
			authorName: "chan9yu"
		});

		expect(ld["@context"]).toBe("https://schema.org");
		expect(ld["@type"]).toBe("WebSite");
		expect(ld.url).toBe("https://chan9yu.dev");
		expect(ld.name).toBe("chan9yu");
		expect(ld.description).toBe("개발 블로그");
		expect(ld.author).toEqual({ "@type": "Person", name: "chan9yu" });
	});

	it("alternateName은 siteName과 다를 때만 낸다 (구글이 고를 대안 이름)", () => {
		const common = { siteUrl: BASE, description: "개발 블로그", authorName: "chan9yu" };

		const withAlternate = buildWebSiteJsonLd({ ...common, siteName: "chan9yu 기술블로그", alternateName: "chan9yu" });
		expect(withAlternate.alternateName).toBe("chan9yu");

		const sameName = buildWebSiteJsonLd({ ...common, siteName: "chan9yu", alternateName: "chan9yu" });
		expect(sameName).not.toHaveProperty("alternateName");

		const noAlternate = buildWebSiteJsonLd({ ...common, siteName: "chan9yu 기술블로그" });
		expect(noAlternate).not.toHaveProperty("alternateName");
	});
});

describe("buildBlogPostingJsonLd", () => {
	it("필수 필드와 절대 URL, inLanguage를 채운다", () => {
		const ld = buildBlogPostingJsonLd({
			siteUrl: BASE,
			authorName: "chan9yu",
			slug: "react-19-use",
			title: "React 19 use 훅",
			description: "use() 동작 원리",
			date: "2026-04-13",
			tags: ["react", "react-19"],
			image: "/posts/react-19-use/images/thumbnail.png"
		});

		expect(ld["@type"]).toBe("BlogPosting");
		expect(ld.headline).toBe("React 19 use 훅");
		expect(ld.description).toBe("use() 동작 원리");
		expect(ld.datePublished).toBe("2026-04-13");
		expect(ld.url).toBe("https://chan9yu.dev/posts/react-19-use");
		expect(ld.mainEntityOfPage).toEqual({
			"@type": "WebPage",
			"@id": "https://chan9yu.dev/posts/react-19-use"
		});
		expect(ld.keywords).toBe("react, react-19");
		expect(ld.inLanguage).toBe("ko-KR");
	});

	it("썸네일이 있으면 썸네일과 /og를 순서대로, 없으면 /og 하나만 담는다", () => {
		const withThumbnail = buildBlogPostingJsonLd({
			siteUrl: BASE,
			authorName: "chan9yu",
			slug: "react-19-use",
			title: "React 19 use 훅",
			description: "d",
			date: "2026-04-13",
			tags: [],
			image: "/posts/react-19-use/images/thumbnail.png"
		});
		const withoutThumbnail = buildBlogPostingJsonLd({
			siteUrl: BASE,
			authorName: "chan9yu",
			slug: "x",
			title: "테스트",
			description: "...",
			date: "2026-04-13",
			tags: []
		});

		expect(withThumbnail.image).toEqual([
			"https://chan9yu.dev/posts/react-19-use/images/thumbnail.png",
			`${BASE}/og?title=${encodeURIComponent("React 19 use 훅")}`
		]);
		expect(withoutThumbnail.image).toEqual([`${BASE}/og?title=${encodeURIComponent("테스트")}`]);
	});

	it("dateModified는 modified가 있으면 그 값, 없으면 datePublished와 같은 값", () => {
		const modified = buildBlogPostingJsonLd({
			siteUrl: BASE,
			authorName: "chan9yu",
			slug: "x",
			title: "t",
			description: "d",
			date: "2026-04-13",
			modified: "2026-04-15",
			tags: []
		});
		const unmodified = buildBlogPostingJsonLd({
			siteUrl: BASE,
			authorName: "chan9yu",
			slug: "x",
			title: "t",
			description: "d",
			date: "2026-04-13",
			tags: []
		});

		expect(modified.dateModified).toBe("2026-04-15");
		expect(unmodified.dateModified).toBe("2026-04-13");
	});
});

describe("buildBreadcrumbJsonLd", () => {
	it("3-tier breadcrumb을 ListItem 배열로 직렬화한다", () => {
		const ld = buildBreadcrumbJsonLd({
			siteUrl: BASE,
			items: [
				{ name: "홈", path: "/" },
				{ name: "포스트", path: "/posts" },
				{ name: "React 19 use 훅", path: "/posts/react-19-use" }
			]
		});

		expect(ld["@type"]).toBe("BreadcrumbList");
		expect(ld.itemListElement).toHaveLength(3);
		expect(ld.itemListElement[0]).toEqual({
			"@type": "ListItem",
			position: 1,
			name: "홈",
			item: "https://chan9yu.dev/"
		});
		const last = ld.itemListElement[2];
		expect(last?.position).toBe(3);
		expect(last?.item).toBe("https://chan9yu.dev/posts/react-19-use");
	});
});

describe("buildPersonJsonLd", () => {
	it("Person 단일 객체를 name과 url, sameAs, image로 생성한다", () => {
		const ld = buildPersonJsonLd({
			name: "chan9yu",
			url: `${BASE}/about`,
			sameAs: ["https://github.com/chan9yu"],
			image: "https://example.com/avatar.png"
		});

		expect(ld["@type"]).toBe("Person");
		expect(ld.name).toBe("chan9yu");
		expect(ld.url).toBe(`${BASE}/about`);
		expect(ld.sameAs).toEqual(["https://github.com/chan9yu"]);
		expect(ld.image).toBe("https://example.com/avatar.png");
	});
});

describe("Person과 BlogPosting author의 @id", () => {
	it("author의 @id와 url이 About 페이지 URL을 넘긴 Person과 이어진다", () => {
		const person = buildPersonJsonLd({ name: "chan9yu", url: `${BASE}/about` });
		const post = buildBlogPostingJsonLd({
			siteUrl: BASE,
			authorName: "chan9yu",
			slug: "x",
			title: "t",
			description: "d",
			date: "2026-04-13",
			tags: []
		});

		expect(person["@id"]).toBe("https://chan9yu.dev/about#person");
		expect(post.author).toEqual({
			"@type": "Person",
			"@id": "https://chan9yu.dev/about#person",
			name: "chan9yu",
			url: "https://chan9yu.dev/about"
		});
		expect(post.author["@id"]).toBe(person["@id"]);
	});
});
