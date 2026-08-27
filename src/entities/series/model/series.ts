export type SeriesMembership = {
	series: string | null;
	seriesOrder: number | null;
};

export type DatedPost = {
	date: string;
};

export type SeriesOrderedPost = {
	slug: string;
	seriesOrder: number | null;
};

export type Series<TPost> = {
	name: string;
	slug: string;
	posts: TPost[];
};
