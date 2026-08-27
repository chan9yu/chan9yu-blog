export const TAG_INDEX_MIN_POSTS = 2;

export type TaggedPost = {
	tags: string[];
};

export type TagCount = {
	tag: string;
	slug: string;
	count: number;
};
