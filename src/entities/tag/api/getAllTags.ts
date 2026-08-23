import type { TaggedPost } from "../model/tag";

export function getAllTags(posts: TaggedPost[]): string[] {
	const tagSet = new Set<string>();
	for (const post of posts) {
		for (const tag of post.tags) {
			tagSet.add(tag);
		}
	}
	return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
}
