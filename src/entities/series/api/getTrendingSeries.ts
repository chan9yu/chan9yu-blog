import type { DatedPost, SeriesMembership } from "../model/series";
import { getAllSeries } from "./getAllSeries";
import { getSeriesStats } from "./getSeriesStats";

const DEFAULT_LIMIT = 3;

export function getTrendingSeries<TPost extends SeriesMembership & DatedPost>(posts: TPost[], limit = DEFAULT_LIMIT) {
	return getAllSeries(posts)
		.map((series) => ({ series, lastUpdated: getSeriesStats(series).lastUpdated ?? "" }))
		.sort((a, b) => {
			const countDiff = b.series.posts.length - a.series.posts.length;
			if (countDiff !== 0) return countDiff;
			return b.lastUpdated.localeCompare(a.lastUpdated);
		})
		.slice(0, limit)
		.map(({ series }) => series);
}
