import type { PostSummary, RelatedPost } from "../model/post";

const DEFAULT_LIMIT = 3;

export function findRelatedPostsByTags(
	posts: PostSummary[],
	target: PostSummary,
	limit = DEFAULT_LIMIT
): RelatedPost[] {
	if (target.tags.length === 0) return [];

	return posts
		.filter((post) => post.slug !== target.slug)
		.map((post) => ({
			...post,
			overlapScore: post.tags.filter((tag) => target.tags.includes(tag)).length
		}))
		.filter((post) => post.overlapScore > 0)
		.sort((a, b) => b.overlapScore - a.overlapScore)
		.slice(0, limit);
}
