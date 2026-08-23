import { describe, expect, it } from "vitest";

import { getTrendingSeries } from "../getTrendingSeries";

const post = (slug: string, series: string, seriesOrder: number, date = "2026-01-01") => ({
	title: slug,
	description: "desc",
	slug,
	date,
	private: false,
	tags: [],
	thumbnail: null,
	series,
	seriesOrder,
	readingTimeMinutes: 1
});

describe("getTrendingSeries", () => {
	it("기본 limit은 3이다", () => {
		const posts = [
			post("a1", "S1", 1),
			post("a2", "S1", 2),
			post("b1", "S2", 1),
			post("c1", "S3", 1),
			post("d1", "S4", 1)
		];
		expect(getTrendingSeries(posts)).toHaveLength(3);
	});

	it("소속 포스트 수 내림차순으로 정렬한다", () => {
		const posts = [
			post("a1", "S1", 1),
			post("a2", "S1", 2),
			post("a3", "S1", 3),
			post("b1", "S2", 1),
			post("c1", "S3", 1),
			post("c2", "S3", 2)
		];
		const result = getTrendingSeries(posts, 5);
		expect(result.map((s) => s.slug)).toEqual(["S1", "S3", "S2"]);
	});

	it("동률 시 최근 편 발행일 내림차순(lastUpdated desc)으로 정렬한다", () => {
		const posts = [
			post("a1", "Older", 1, "2026-01-01"),
			post("a2", "Older", 2, "2026-02-01"),
			post("b1", "Newer", 1, "2026-03-01"),
			post("b2", "Newer", 2, "2026-06-01")
		];
		const result = getTrendingSeries(posts, 5);
		expect(result.map((s) => s.slug)).toEqual(["Newer", "Older"]);
	});

	it("limit이 시리즈 수보다 크면 모두 반환한다", () => {
		const posts = [post("a1", "S1", 1)];
		expect(getTrendingSeries(posts, 10)).toHaveLength(1);
	});

	it("빈 입력에는 빈 배열을 반환한다", () => {
		expect(getTrendingSeries([], 3)).toEqual([]);
	});

	it("series가 null인 포스트만 있으면 빈 배열을 반환한다", () => {
		const noSeriesPost = {
			title: "x",
			description: "d",
			slug: "x",
			date: "2026-01-01",
			private: false,
			tags: [],
			thumbnail: null,
			series: null,
			seriesOrder: null,
			readingTimeMinutes: 1
		};
		expect(getTrendingSeries([noSeriesPost], 3)).toEqual([]);
	});
});
