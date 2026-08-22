import type { PostSummary } from "./post";

export type Series = {
	name: string;
	slug: string;
	posts: PostSummary[];
};

export type SeriesStats = {
	total: number;
	firstPublished: string | null;
	lastUpdated: string | null;
};
