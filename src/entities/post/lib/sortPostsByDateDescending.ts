import type { PostSummary } from "../model/post";

export function sortPostsByDateDescending(posts: PostSummary[]) {
	return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
