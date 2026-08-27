import type { PostFrontmatter } from "./frontmatter";

export type PostSummary = PostFrontmatter & {
	readingTimeMinutes: number;
};

export type TocItem = {
	id: string;
	level: 1 | 2 | 3;
	text: string;
};

export type AdjacentPosts = {
	prev: PostSummary | null;
	next: PostSummary | null;
};

export type RelatedPost = PostSummary & {
	overlapScore: number;
};
