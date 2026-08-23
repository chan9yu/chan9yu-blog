import { getPublicPosts } from "@/entities/post/index.server";
import { BADGE_CACHE_CONTROL, BADGE_RECENT_COUNT, parseBadgeIndex } from "@/shared/config/badge";
import { getSiteUrl } from "@/shared/config/site";

export function badgeIndices() {
	const count = Math.min(BADGE_RECENT_COUNT, getPublicPosts().length);
	return Array.from({ length: count }, (_, index) => index);
}

export function generateBadgeRedirectParams() {
	return badgeIndices().map((index) => ({ index: String(index) }));
}

export async function redirectToRecentPost(_req: Request, { params }: { params: Promise<{ index: string }> }) {
	const { index: raw } = await params;
	const index = parseBadgeIndex(raw);
	if (index === null) return new Response("Not Found", { status: 404 });

	const post = getPublicPosts()[index];
	if (!post) return new Response("Not Found", { status: 404 });

	return new Response(null, {
		status: 302,
		headers: {
			Location: `${getSiteUrl()}/posts/${post.slug}`,
			"Cache-Control": BADGE_CACHE_CONTROL
		}
	});
}
