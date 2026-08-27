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
	it("lastUpdated는 가장 최근 발행일이다", () => {
		const stats = getSeriesStats(series([post("a", "2026-03-01"), post("b", "2026-01-15"), post("c", "2026-02-01")]));
		expect(stats.lastUpdated).toBe("2026-03-01");
	});
});
