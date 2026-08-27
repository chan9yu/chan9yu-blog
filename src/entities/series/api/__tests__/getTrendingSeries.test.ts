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
});
