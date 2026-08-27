import { formatLocalizedSlug } from "@/shared/lib/format/formatLocalizedSlug";

import type { SeriesMembership } from "../model/series";
import type { SeriesMeta } from "../model/seriesMeta";

type SeriesPost<TPost> = TPost & { series: string; seriesOrder: number };

function isSeriesPost<TPost extends SeriesMembership>(post: TPost): post is SeriesPost<TPost> {
	return post.series !== null && post.seriesOrder !== null;
}

export function getAllSeries<TPost extends SeriesMembership>(posts: TPost[], metaBySlug?: Map<string, SeriesMeta>) {
	const seriesMap = new Map<string, SeriesPost<TPost>[]>();

	for (const post of posts) {
		if (!isSeriesPost(post)) continue;
		const existing = seriesMap.get(post.series) ?? [];
		existing.push(post);
		seriesMap.set(post.series, existing);
	}

	return Array.from(seriesMap.entries()).map(([seriesId, seriesPosts]) => {
		const meta = metaBySlug?.get(seriesId);

		return {
			name: meta?.title ?? formatLocalizedSlug(seriesId),
			slug: seriesId,
			description: meta?.description ?? null,
			posts: [...seriesPosts].sort((a, b) => a.seriesOrder - b.seriesOrder)
		};
	});
}
