const VIEWS_ENDPOINT = "/api/views";

type ViewsResponse = {
	views: number;
};

function isViewsResponse(value: unknown): value is ViewsResponse {
	return typeof value === "object" && value !== null && typeof (value as { views?: unknown }).views === "number";
}

export async function fetchPostViewsOrNull(slug: string) {
	try {
		const res = await fetch(`${VIEWS_ENDPOINT}?slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
		if (!res.ok) {
			console.warn(`[views] GET ${slug} failed: ${res.status}`);
			return null;
		}

		const data: unknown = await res.json();
		if (!isViewsResponse(data)) {
			console.warn(`[views] GET ${slug} returned malformed payload`);
			return null;
		}

		return data.views;
	} catch (error) {
		console.warn(`[views] GET ${slug} network error`, error);
		return null;
	}
}

export async function incrementPostViews(slug: string) {
	try {
		const res = await fetch(VIEWS_ENDPOINT, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ slug })
		});

		if (!res.ok) {
			console.warn(`[views] POST ${slug} failed: ${res.status}`);
		}
	} catch (error) {
		console.warn(`[views] POST ${slug} network error`, error);
	}
}
