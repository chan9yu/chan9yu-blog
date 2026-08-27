import type { NextRequest } from "next/server";

import { getRedis, hasRedisCredentials, postViewsKey } from "@/shared/lib/redis";
import { validateSlug } from "@/shared/lib/slug/slug";

const NO_STORE_HEADERS = { "cache-control": "no-store" } as const;

export async function getPostViews(req: NextRequest) {
	const slug = validateSlug(new URL(req.url).searchParams.get("slug"));
	if (!slug) {
		return Response.json({ error: "invalid slug" }, { status: 400, headers: NO_STORE_HEADERS });
	}

	if (!hasRedisCredentials()) {
		return Response.json({ views: 0 }, { headers: NO_STORE_HEADERS });
	}

	try {
		const stored = await getRedis().get<number>(postViewsKey(slug));
		return Response.json({ views: stored ?? 0 }, { headers: NO_STORE_HEADERS });
	} catch (error) {
		console.warn(`[views] GET ${slug} redis error`, error);
		return Response.json({ views: 0 }, { headers: NO_STORE_HEADERS });
	}
}

export async function recordPostView(req: NextRequest) {
	const raw: unknown = await req.json().catch(() => null);
	if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
		return Response.json({ error: "invalid JSON body" }, { status: 400, headers: NO_STORE_HEADERS });
	}

	const slug = "slug" in raw ? validateSlug(raw.slug) : null;
	if (!slug) {
		return Response.json({ error: "invalid slug" }, { status: 400, headers: NO_STORE_HEADERS });
	}

	if (!hasRedisCredentials()) {
		return new Response(null, { status: 204, headers: NO_STORE_HEADERS });
	}

	try {
		await getRedis().incr(postViewsKey(slug));
	} catch (error) {
		console.warn(`[views] POST ${slug} redis error`, error);
	}

	return new Response(null, { status: 204, headers: NO_STORE_HEADERS });
}
