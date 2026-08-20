import { getRedis, hasRedisCredentials } from "@/shared/libs/redis";
import type { PostSummary } from "@/shared/types";

const VIEW_KEY_PREFIX = "views:post:";
const DEFAULT_LIMIT = 5;

// Redis 미설정 PR preview와 로컬 빌드를 깨지 않도록 fallback. `fallback: true` 플래그로 호출자가 UI 분기 가능.
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

// 호출자 정렬 계약에 의존하지 않도록 자체 date desc 재정렬 — fallback 동작이 조용히 깨지지 않도록 방어.
function pickRecentPosts(posts: PostSummary[], limit: number) {
	return [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}

async function fetchViewsMap(slugs: string[]) {
	const keys = slugs.map((slug) => `${VIEW_KEY_PREFIX}${slug}`);
	const values = await getRedis().mget<Array<number | null>>(...keys);
	return Object.fromEntries(slugs.map((slug, index) => [slug, values[index] ?? 0]));
}
