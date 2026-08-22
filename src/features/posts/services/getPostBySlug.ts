import { getAllPosts } from "./getAllPosts";

export function getPostBySlug(slug: string) {
	const post = getAllPosts({ includePrivate: true }).find((item) => item.slug === slug);
	return !post || post.private ? null : post;
}
