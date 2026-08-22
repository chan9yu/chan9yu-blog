import fs from "node:fs";
import path from "node:path";

import type { PostSummary } from "@/shared/types";

const PLACEHOLDER_COUNT = 5;
const DEFAULT_FALLBACK = "/posts/placeholder.svg";

function hashSlug(slug: string) {
	let hash = 0x811c9dc5;
	for (let index = 0; index < slug.length; index += 1) {
		hash ^= slug.charCodeAt(index);
		hash = (hash + ((hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24))) >>> 0;
	}

	return hash;
}

function placeholderForSlug(slug: string) {
	const bucket = (hashSlug(slug) % PLACEHOLDER_COUNT) + 1;
	return `/posts/placeholders/cover-${bucket}.svg`;
}

export function resolveThumbnailSrc(thumbnail: string | null, slug?: string) {
	if (!thumbnail) {
		return null;
	}

	const publicPath = path.join(process.cwd(), "public", thumbnail.replace(/^\//, ""));
	if (fs.existsSync(publicPath)) {
		return thumbnail;
	}

	return slug ? placeholderForSlug(slug) : DEFAULT_FALLBACK;
}

export function resolvePostThumbnails(posts: PostSummary[]) {
	return posts.map((post) => ({
		...post,
		thumbnail: resolveThumbnailSrc(post.thumbnail, post.slug)
	}));
}
