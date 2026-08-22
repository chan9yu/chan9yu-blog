import type { PostSummary } from "@/shared/types";
import { formatLocalizedSlug } from "@/shared/utils/formatLocalizedSlug";

import type { SeriesMeta } from "../schemas/seriesMeta";

type SeriesPost = PostSummary & { series: string; seriesOrder: number };

function isSeriesPost(post: PostSummary): post is SeriesPost {
	return post.series !== null && post.seriesOrder !== null;
}

export function getAllSeries(posts: PostSummary[], metaBySlug?: Map<string, SeriesMeta>) {
	const seriesMap = new Map<string, SeriesPost[]>();

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
