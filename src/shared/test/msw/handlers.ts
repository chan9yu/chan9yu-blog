import { http, HttpResponse } from "msw";

import { validateSlug } from "@/shared/utils/slug";

const viewsStore = new Map<string, number>();

export const viewsHandlers = [
	http.get("/api/views", ({ request }) => {
		const slug = validateSlug(new URL(request.url).searchParams.get("slug"));
		return slug
			? HttpResponse.json({ views: viewsStore.get(slug) ?? 0 })
			: HttpResponse.json({ error: "invalid slug" }, { status: 400 });
	}),

	http.post("/api/views", async ({ request }) => {
		let raw: unknown;

		try {
			raw = await request.json();
		} catch {
			return HttpResponse.json({ error: "invalid JSON body" }, { status: 400 });
		}

		if (typeof raw !== "object" || raw === null) {
			return HttpResponse.json({ error: "invalid JSON body" }, { status: 400 });
		}

		const slug = validateSlug((raw as Record<string, unknown>).slug);
		if (!slug) {
			return HttpResponse.json({ error: "invalid slug" }, { status: 400 });
		}

		viewsStore.set(slug, (viewsStore.get(slug) ?? 0) + 1);

		return new HttpResponse(null, { status: 204 });
	})
];

export const handlers = [...viewsHandlers];

export function seedMockView(slug: string, count: number) {
	viewsStore.set(slug, count);
}

export function resetMockViews() {
	viewsStore.clear();
}
