import { describe, expect, it } from "vitest";

import type { SeriesMembership } from "../../model/series";
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

	it("같은 series 이름의 포스트는 하나의 Series로 그룹핑된다", () => {
		const posts = [
			post("a", { series: "S1", seriesOrder: 2 }),
			post("b", { series: "S1", seriesOrder: 1 }),
			post("c", { series: "S1", seriesOrder: 3 })
		];
		const result = getAllSeries(posts);
		expect(result).toHaveLength(1);
		expect(result[0]?.posts).toHaveLength(3);
	});

	it("Series.posts는 seriesOrder 오름차순으로 정렬된다", () => {
		const posts = [
			post("a", { series: "S1", seriesOrder: 3 }),
			post("b", { series: "S1", seriesOrder: 1 }),
			post("c", { series: "S1", seriesOrder: 2 })
		];
		const result = getAllSeries(posts);
		expect(result[0]?.posts.map((p) => p.slug)).toEqual(["b", "c", "a"]);
	});

	it("name과 slug는 series 원문 값을 그대로 사용한다", () => {
		const posts = [post("a", { series: "WebRTC 박살내기!", seriesOrder: 1 })];
		const result = getAllSeries(posts);
		expect(result[0]?.name).toBe("WebRTC 박살내기!");
		expect(result[0]?.slug).toBe("WebRTC 박살내기!");
	});

	it("series는 있지만 seriesOrder가 null인 포스트는 (Zod 위반 케이스로) 무시한다", () => {
		const posts = [post("a", { series: "S1", seriesOrder: null }), post("b", { series: "S1", seriesOrder: 1 })];
		const result = getAllSeries(posts);
		expect(result[0]?.posts.map((p) => p.slug)).toEqual(["b"]);
	});

	it("빈 입력에는 빈 배열을 반환한다", () => {
		expect(getAllSeries([])).toEqual([]);
	});
});

describe("getSeriesDetail", () => {
	it("slug와 매칭되는 시리즈를 반환한다", () => {
		const posts = [post("a", { series: "S1", seriesOrder: 1 }), post("b", { series: "S2", seriesOrder: 1 })];
		const result = getSeriesDetail(posts, "S1");
		expect(result?.name).toBe("S1");
		expect(result?.posts).toHaveLength(1);
	});

	it("매칭되는 시리즈가 없으면 null을 반환한다", () => {
		const posts = [post("a", { series: "S1", seriesOrder: 1 })];
		expect(getSeriesDetail(posts, "missing")).toBeNull();
	});
});
