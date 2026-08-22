import type { PostSummary } from "@/shared/types";

import type { SeriesMeta } from "../schemas/seriesMeta";
import { getAllSeries } from "./getAllSeries";

export function getSeriesDetail(posts: PostSummary[], slug: string, metaBySlug?: Map<string, SeriesMeta>) {
	return getAllSeries(posts, metaBySlug).find((series) => series.slug === slug) ?? null;
}
