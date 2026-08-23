import type { TaggedPost } from "../model/tag";

export function getPostsByTag<TPost extends TaggedPost>(posts: TPost[], tag: string) {
	return posts.filter((post) => post.tags.includes(tag));
}
