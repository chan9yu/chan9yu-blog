import { describe, expect, it } from "vitest";

import type { Series } from "../../model/series";
import { getSeriesStats } from "../getSeriesStats";

const post = (slug: string, date: string) => ({
	title: slug,
	description: "desc",
	slug,
	date,
	private: false,
	tags: [],
	thumbnail: null,
	series: "S1",
	seriesOrder: 1,
	readingTimeMinutes: 1
});

type TestPost = ReturnType<typeof post>;

const series = (posts: TestPost[]): Series<TestPost> => ({
	name: "S1",
	slug: "S1",
	posts
});

describe("getSeriesStats", () => {
	it("total은 posts 개수와 같다", () => {
		const stats = getSeriesStats(series([post("a", "2026-01-01"), post("b", "2026-02-01")]));
		expect(stats.total).toBe(2);
	});

	it("firstPublished는 가장 오래된 발행일이다", () => {
		const stats = getSeriesStats(series([post("a", "2026-03-01"), post("b", "2026-01-15"), post("c", "2026-02-01")]));
		expect(stats.firstPublished).toBe("2026-01-15");
	});

	it("lastUpdated는 가장 최근 발행일이다", () => {
		const stats = getSeriesStats(series([post("a", "2026-03-01"), post("b", "2026-01-15"), post("c", "2026-02-01")]));
		expect(stats.lastUpdated).toBe("2026-03-01");
	});

	it("posts가 1개면 firstPublished와 lastUpdated가 같다", () => {
		const stats = getSeriesStats(series([post("a", "2026-01-01")]));
		expect(stats.firstPublished).toBe("2026-01-01");
		expect(stats.lastUpdated).toBe("2026-01-01");
	});

	it("빈 시리즈에는 total 0과 null 발행일을 반환한다", () => {
		const stats = getSeriesStats(series([]));
		expect(stats).toEqual({ total: 0, firstPublished: null, lastUpdated: null });
	});

	it("seriesOrder 정렬 순서와 무관하게 발행일 비교가 작동한다", () => {
		const reordered = [post("z", "2026-01-01"), post("a", "2026-12-01")];
		const stats = getSeriesStats(series(reordered));
		expect(stats.firstPublished).toBe("2026-01-01");
		expect(stats.lastUpdated).toBe("2026-12-01");
	});
});
