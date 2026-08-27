import { describe, expect, it } from "vitest";

import type { SeriesMembership } from "../../model/series";
import type { SeriesMeta } from "../../model/seriesMeta";
import { getAllSeries } from "../getAllSeries";
import { getSeriesDetail } from "../getSeriesDetail";

const post = (slug: string, overrides: Partial<SeriesMembership> = {}) => ({
	title: slug,
	description: "desc",
	slug,
	date: "2026-01-01",
	private: false,
	tags: [],
	thumbnail: null,
	series: null,
	seriesOrder: null,
	readingTimeMinutes: 1,
	...overrides
});

describe("getAllSeries", () => {
	it("series 필드가 null인 포스트는 건너뛴다", () => {
		const posts = [post("a"), post("b", { series: "S1", seriesOrder: 1 })];
		const result = getAllSeries(posts);
		expect(result).toHaveLength(1);
		expect(result[0]?.slug).toBe("S1");
	});

	it("같은 series 이름은 한 그룹으로 묶이고 posts는 seriesOrder 오름차순으로 정렬된다", () => {
		const posts = [
			post("a", { series: "S1", seriesOrder: 3 }),
			post("b", { series: "S1", seriesOrder: 1 }),
			post("c", { series: "S1", seriesOrder: 2 })
		];
		const result = getAllSeries(posts);
		expect(result).toHaveLength(1);
		expect(result[0]?.posts.map((p) => p.slug)).toEqual(["b", "c", "a"]);
	});

	it("slug는 series 원문이고 name은 meta가 없으면 한글 id의 하이픈을 공백으로 바꾼 값이다", () => {
		const posts = [post("a", { series: "WebRTC-박살내기", seriesOrder: 1 })];
		const result = getAllSeries(posts);
		expect(result[0]?.slug).toBe("WebRTC-박살내기");
		expect(result[0]?.name).toBe("WebRTC 박살내기");
		expect(result[0]?.description).toBeNull();

		const metaBySlug = new Map<string, SeriesMeta>([
			["WebRTC-박살내기", { title: "WebRTC 박살내기 완전판", description: "시리즈 설명입니다." }]
		]);
		const withMeta = getAllSeries(posts, metaBySlug);
		expect(withMeta[0]?.slug).toBe("WebRTC-박살내기");
		expect(withMeta[0]?.name).toBe("WebRTC 박살내기 완전판");
		expect(withMeta[0]?.description).toBe("시리즈 설명입니다.");
	});
});

describe("getSeriesDetail", () => {
	it("name이 아니라 slug로 시리즈를 찾는다", () => {
		const posts = [
			post("a", { series: "WebRTC-박살내기", seriesOrder: 1 }),
			post("b", { series: "RADIO로-시스템-디자인하기", seriesOrder: 1 })
		];
		const result = getSeriesDetail(posts, "WebRTC-박살내기");
		expect(result?.slug).toBe("WebRTC-박살내기");
		expect(result?.name).toBe("WebRTC 박살내기");
		expect(result?.posts.map((p) => p.slug)).toEqual(["a"]);
	});

	it("매칭되는 시리즈가 없으면 null을 반환한다", () => {
		const posts = [post("a", { series: "S1", seriesOrder: 1 })];
		expect(getSeriesDetail(posts, "missing")).toBeNull();
	});
});
