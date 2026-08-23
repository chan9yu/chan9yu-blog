import type { Series, SeriesOrderedPost } from "../model/series";

export function getAdjacentInSeries<TPost extends SeriesOrderedPost>(series: Series<TPost>, currentSlug: string) {
	const ordered = [...series.posts].sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
	const index = ordered.findIndex((post) => post.slug === currentSlug);

	if (index === -1) {
		return { prev: null, next: null, order: null, total: ordered.length };
	}

	return {
		prev: index > 0 ? (ordered[index - 1] ?? null) : null,
		next: index < ordered.length - 1 ? (ordered[index + 1] ?? null) : null,
		order: ordered[index]?.seriesOrder ?? null,
		total: ordered.length
	};
}
