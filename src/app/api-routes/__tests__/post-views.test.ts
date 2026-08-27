import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getPostViews as GET, recordPostView as POST } from "../post-views";

const { redisStore, fakeRedis } = vi.hoisted(() => {
	const redisStore = new Map<string, number>();

	return {
		redisStore,
		fakeRedis: {
			get: async (key: string) => redisStore.get(key) ?? null,
			incr: async (key: string) => {
				const next = (redisStore.get(key) ?? 0) + 1;
				redisStore.set(key, next);
				return next;
			}
		}
	};
});

vi.mock("@/shared/lib/redis", () => ({
	getRedis: () => fakeRedis,
	hasRedisCredentials: () => true
}));

beforeEach(() => {
	redisStore.clear();
	vi.clearAllMocks();
});

type PostBody = { type: "json"; data: unknown } | { type: "malformed" };

function buildGetRequest(slug: string | null) {
	const url = slug === null ? "http://localhost/api/views" : `http://localhost/api/views?slug=${slug}`;
	return new NextRequest(url);
}

function buildPostRequest(body: PostBody) {
	const payload = body.type === "malformed" ? "not-json" : JSON.stringify(body.data);
	return new NextRequest("http://localhost/api/views", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: payload
	});
}

describe("GET /api/views", () => {
	it("유효한 slug는 200으로 views 숫자만 돌려준다 (slug 누설 금지)", async () => {
		const res = await GET(buildGetRequest("react-19-use"));
		expect(res.status).toBe(200);
		const body = (await res.json()) as Record<string, unknown>;
		expect(typeof body.views).toBe("number");
		expect(Object.keys(body).sort()).toEqual(["views"]);
	});

	it("Cache-Control: no-store 헤더 포함", async () => {
		const res = await GET(buildGetRequest("react-19-use"));
		expect(res.headers.get("cache-control") ?? "").toMatch(/no-store/);
	});

	it("slug가 없거나 영문 소문자와 숫자, 하이픈 밖이면 400", async () => {
		for (const slug of [null, "", "invalid%20slug", "React-19"]) {
			const res = await GET(buildGetRequest(slug));
			expect(res.status, String(slug)).toBe(400);
		}
	});
});

describe("POST /api/views", () => {
	it("유효한 slug는 204 no content와 no-store 헤더로 응답한다", async () => {
		const res = await POST(buildPostRequest({ type: "json", data: { slug: "react-19-use" } }));
		expect(res.status).toBe(204);
		expect(res.headers.get("cache-control") ?? "").toMatch(/no-store/);
	});

	it("slug 필드가 없거나 무효하면 400", async () => {
		for (const data of [{}, { slug: "invalid slug" }]) {
			const res = await POST(buildPostRequest({ type: "json", data }));
			expect(res.status, JSON.stringify(data)).toBe(400);
		}
	});

	it("본문이 파싱 실패거나 객체가 아니면 400", async () => {
		const malformed = await POST(buildPostRequest({ type: "malformed" }));
		const primitive = await POST(buildPostRequest({ type: "json", data: "just-a-string" }));

		expect(malformed.status).toBe(400);
		expect(primitive.status).toBe(400);
	});
});
