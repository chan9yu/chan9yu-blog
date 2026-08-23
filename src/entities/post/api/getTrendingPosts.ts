import { getRedis, hasRedisCredentials, postViewsKey } from "@/shared/lib/redis";

import { sortPostsByDateDescending } from "../lib/sortPostsByDateDescending";
import type { PostSummary } from "../model/post";

const DEFAULT_LIMIT = 5;

export async function getTrendingPosts(posts: PostSummary[], limit = DEFAULT_LIMIT) {
	if (posts.length === 0) {
		return { posts: [], fallback: false };
	}

	if (!hasRedisCredentials()) {
		return { posts: pickRecentPosts(posts, limit), fallback: true };
	}

	try {
		const viewsMap = await fetchViewsMap(posts.map((post) => post.slug));
		const sorted = [...posts].sort((a, b) => {
			const viewDiff = (viewsMap[b.slug] ?? 0) - (viewsMap[a.slug] ?? 0);
			if (viewDiff !== 0) return viewDiff;
			return b.date.localeCompare(a.date);
		});
		return { posts: sorted.slice(0, limit), fallback: false };
	} catch (error) {
		console.warn("[getTrendingPosts] Redis fetch failed, falling back to date-desc:", error);
		return { posts: pickRecentPosts(posts, limit), fallback: true };
	}
}

function pickRecentPosts(posts: PostSummary[], limit: number) {
	return sortPostsByDateDescending(posts).slice(0, limit);
}

async function fetchViewsMap(slugs: string[]) {
	const keys = slugs.map(postViewsKey);
	const values = await getRedis().mget<Array<number | null>>(...keys);
	return Object.fromEntries(slugs.map((slug, index) => [slug, values[index] ?? 0]));
}
