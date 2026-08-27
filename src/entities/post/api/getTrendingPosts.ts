import { unstable_cache } from "next/cache";
import { unstable_rethrow } from "next/navigation";

import { getRedis, hasRedisCredentials, postViewsKey } from "@/shared/lib/redis";

import { sortPostsByDateDescending } from "../lib/sortPostsByDateDescending";
import type { PostSummary } from "../model/post";

const DEFAULT_LIMIT = 5;
const VIEWS_REVALIDATE_SECONDS = 3600;

export async function getTrendingPosts(posts: PostSummary[], limit = DEFAULT_LIMIT) {
	if (posts.length === 0) {
		return { posts: [], fallback: false };
	}

	if (!hasRedisCredentials()) {
		return { posts: pickRecentPosts(posts, limit), fallback: true };
	}

	try {
		const viewsMap = await getCachedViewsMap(posts.map((post) => post.slug));
		const sorted = [...posts].sort((a, b) => {
			const viewDiff = (viewsMap[b.slug] ?? 0) - (viewsMap[a.slug] ?? 0);
			if (viewDiff !== 0) return viewDiff;
			return b.date.localeCompare(a.date);
		});
		return { posts: sorted.slice(0, limit), fallback: false };
	} catch (error) {
		unstable_rethrow(error);
		console.warn("[getTrendingPosts] Redis fetch failed, falling back to date-desc:", error);
		return { posts: pickRecentPosts(posts, limit), fallback: true };
	}
}

function pickRecentPosts(posts: PostSummary[], limit: number) {
	return sortPostsByDateDescending(posts).slice(0, limit);
}

const getCachedViewsMap = unstable_cache(fetchViewsMap, ["post-views-map"], {
	revalidate: VIEWS_REVALIDATE_SECONDS
});

async function fetchViewsMap(slugs: string[]) {
	const keys = slugs.map(postViewsKey);
	const values = await getRedis().mget<Array<number | null>>(...keys);
	return Object.fromEntries(slugs.map((slug, index) => [slug, values[index] ?? 0]));
}
