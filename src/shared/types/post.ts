export type PostFrontmatter = {
	title: string;
	description: string;
	slug: string;
	date: string;
	updated?: string;
	private: boolean;
	tags: string[];
	thumbnail: string | null;
	series: string | null;
	seriesOrder: number | null;
};

export type PostSummary = PostFrontmatter & {
	readingTimeMinutes: number;
};

export type TocItem = {
	id: string;
	level: 1 | 2 | 3;
	text: string;
};

export type PostDetail = PostSummary & {
	contentMdx: string;
	toc: TocItem[];
};

export type AdjacentPosts = {
	prev: PostSummary | null;
	next: PostSummary | null;
};

export type RelatedPost = PostSummary & {
	overlapScore: number;
};
