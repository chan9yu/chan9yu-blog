import type { PostSummary } from "@/shared/types";

export function findAdjacentPosts(posts: PostSummary[], slug: string) {
	const index = posts.findIndex((post) => post.slug === slug);

	if (index === -1) {
		return { prev: null, next: null };
	}

	return {
		prev: index < posts.length - 1 ? (posts[index + 1] ?? null) : null,
		next: index > 0 ? (posts[index - 1] ?? null) : null
	};
}
