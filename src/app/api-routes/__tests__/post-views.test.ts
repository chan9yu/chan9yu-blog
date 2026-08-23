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
	it("유효한 slug는 200 + views: number 반환", async () => {
		const res = await GET(buildGetRequest("react-19-use"));
		expect(res.status).toBe(200);
		const body = (await res.json()) as Record<string, unknown>;
		expect(typeof body.views).toBe("number");
	});

	it("응답 body는 views 필드만 포함 (slug 누설 금지)", async () => {
		const res = await GET(buildGetRequest("react-19-use"));
		const body = (await res.json()) as Record<string, unknown>;
		expect(Object.keys(body).sort()).toEqual(["views"]);
	});

	it("Cache-Control: no-store 헤더 포함", async () => {
		const res = await GET(buildGetRequest("react-19-use"));
		expect(res.headers.get("cache-control") ?? "").toMatch(/no-store/);
	});

	it("slug 누락 → 400", async () => {
		const res = await GET(buildGetRequest(null));
		expect(res.status).toBe(400);
	});

	it("빈 slug → 400", async () => {
		const res = await GET(buildGetRequest(""));
		expect(res.status).toBe(400);
	});

	it("공백이 포함된 무효 slug → 400", async () => {
		const res = await GET(buildGetRequest("invalid%20slug"));
		expect(res.status).toBe(400);
	});

	it("대문자 slug → 400 (영문 소문자+숫자+하이픈만 허용)", async () => {
		const res = await GET(buildGetRequest("React-19"));
		expect(res.status).toBe(400);
	});
});

describe("POST /api/views", () => {
	it("유효한 slug → 204 no content", async () => {
		const res = await POST(buildPostRequest({ type: "json", data: { slug: "react-19-use" } }));
		expect(res.status).toBe(204);
	});

	it("Cache-Control: no-store 헤더 포함", async () => {
		const res = await POST(buildPostRequest({ type: "json", data: { slug: "react-19-use" } }));
		expect(res.headers.get("cache-control") ?? "").toMatch(/no-store/);
	});

	it("slug 필드 누락 → 400", async () => {
		const res = await POST(buildPostRequest({ type: "json", data: {} }));
		expect(res.status).toBe(400);
	});

	it("공백이 포함된 무효 slug → 400", async () => {
		const res = await POST(buildPostRequest({ type: "json", data: { slug: "invalid slug" } }));
		expect(res.status).toBe(400);
	});

	it("malformed JSON body(파싱 실패) → 400", async () => {
		const res = await POST(buildPostRequest({ type: "malformed" }));
		expect(res.status).toBe(400);
	});

	it("JSON body가 string primitive → 400", async () => {
		const res = await POST(buildPostRequest({ type: "json", data: "just-a-string" }));
		expect(res.status).toBe(400);
	});

	it("JSON body가 null → 400", async () => {
		const res = await POST(buildPostRequest({ type: "json", data: null }));
		expect(res.status).toBe(400);
	});
});
