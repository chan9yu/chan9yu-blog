import type { SeriesMembership } from "../model/series";
import type { SeriesMeta } from "../model/seriesMeta";
import { getAllSeries } from "./getAllSeries";

export function getSeriesDetail<TPost extends SeriesMembership>(
	posts: TPost[],
	slug: string,
	metaBySlug?: Map<string, SeriesMeta>
) {
	return getAllSeries(posts, metaBySlug).find((series) => series.slug === slug) ?? null;
}
