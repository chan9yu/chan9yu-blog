/**
 * RT-/api/views Route Handler 계약 테스트 — PRD §7.5 + ROADMAP M3-08.
 *
 * - `GET /api/views?slug=xxx` → 200 + `{ views: number }` (slug 필드 누설 금지)
 * - `POST /api/views { slug }` → **204 no body**
 * - 잘못된 입력 → 400
 * - `Cache-Control: no-store` (GET·POST 모두)
 *
 * Route Handler 함수를 직접 호출하는 서버 단위 테스트. MSW/kv-client는 별개 레이어.
 * 이 파일이 **프로듀서↔MSW mock 드리프트의 유일한 게이트**이므로 exact-shape 강제가 핵심.
 *
 * M3-07 [Red] 단계 — 현재 placeholder가 PRD 위반(slug 누설 / 200 + body / no-store 헤더 미설정)으로
 * shape·status·header 단언이 실패. M3-08 [Green]에서 Redis 연결 + PRD shape 정합화 시 녹색 전환.
 */

import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET, POST } from "../route";

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

vi.mock("@/shared/libs/redis", () => ({
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

	it("Content-Type: application/json 응답 헤더", async () => {
		const res = await GET(buildGetRequest("react-19-use"));
		expect(res.headers.get("content-type") ?? "").toMatch(/application\/json/);
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
		// URL 인코딩된 공백 → searchParams.get이 자동 디코드 → validateSlug가 거부
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

	it("204 응답은 body가 비어있음", async () => {
		const res = await POST(buildPostRequest({ type: "json", data: { slug: "react-19-use" } }));
		const text = await res.text();
		expect(text).toBe("");
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
		// JSON.stringify("x") = "\"x\"" 이므로 유효 JSON이지만 object가 아니어서 거부
		const res = await POST(buildPostRequest({ type: "json", data: "just-a-string" }));
		expect(res.status).toBe(400);
	});

	it("JSON body가 null → 400", async () => {
		// JSON.stringify(null) = "null" 이므로 유효 JSON이지만 object가 아니어서 거부
		const res = await POST(buildPostRequest({ type: "json", data: null }));
		expect(res.status).toBe(400);
	});
});
