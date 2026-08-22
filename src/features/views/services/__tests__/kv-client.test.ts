import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { seedMockView } from "@/shared/test/msw/handlers";
import { server } from "@/shared/test/msw/server";

import { getBatchPostViews, getPostViews, incrementPostViews } from "../kv-client";

beforeEach(() => {
	vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe("getPostViews", () => {
	it("저장된 slug의 조회수를 반환", async () => {
		seedMockView("react-19-use", 42);
		await expect(getPostViews("react-19-use")).resolves.toBe(42);
		expect(console.warn).not.toHaveBeenCalled();
	});

	it("미등록 slug는 0", async () => {
		await expect(getPostViews("never-seen")).resolves.toBe(0);
		expect(console.warn).not.toHaveBeenCalled();
	});

	it("서버 에러 시 조용히 0 fallback", async () => {
		server.use(http.get("/api/views", () => HttpResponse.json({ error: "internal" }, { status: 500 })));
		await expect(getPostViews("any")).resolves.toBe(0);
		expect(console.warn).toHaveBeenCalled();
	});

	it("네트워크 에러 시 조용히 0 fallback", async () => {
		server.use(http.get("/api/views", () => HttpResponse.error()));
		await expect(getPostViews("any")).resolves.toBe(0);
		expect(console.warn).toHaveBeenCalled();
	});

	it("응답 shape가 깨지면 0 fallback", async () => {
		server.use(http.get("/api/views", () => HttpResponse.json({ wrong: "payload" })));
		await expect(getPostViews("any")).resolves.toBe(0);
		expect(console.warn).toHaveBeenCalled();
	});

	it("잘못된 slug 요청은 조용히 0 fallback", async () => {
		await expect(getPostViews("invalid slug with space")).resolves.toBe(0);
		expect(console.warn).toHaveBeenCalled();
	});
});

describe("incrementPostViews", () => {
	it("POST 성공 시 조회수가 +1", async () => {
		seedMockView("post-a", 5);
		await incrementPostViews("post-a");
		await expect(getPostViews("post-a")).resolves.toBe(6);
		expect(console.warn).not.toHaveBeenCalled();
	});

	it("최초 호출 시 0 → 1", async () => {
		await incrementPostViews("fresh-post");
		await expect(getPostViews("fresh-post")).resolves.toBe(1);
		expect(console.warn).not.toHaveBeenCalled();
	});

	it("잘못된 slug는 조용히 무시 (throw 금지)", async () => {
		await expect(incrementPostViews("invalid slug with space")).resolves.toBeUndefined();
		expect(console.warn).toHaveBeenCalled();
	});

	it("네트워크 에러도 조용히 무시", async () => {
		server.use(http.post("/api/views", () => HttpResponse.error()));
		await expect(incrementPostViews("any")).resolves.toBeUndefined();
		expect(console.warn).toHaveBeenCalled();
	});
});

describe("getBatchPostViews", () => {
	it("slug 배열을 Record로 변환", async () => {
		seedMockView("a", 1);
		seedMockView("b", 2);
		seedMockView("c", 3);
		await expect(getBatchPostViews(["a", "b", "c"])).resolves.toEqual({
			a: 1,
			b: 2,
			c: 3
		});
		expect(console.warn).not.toHaveBeenCalled();
	});

	it("빈 배열 → 빈 객체", async () => {
		await expect(getBatchPostViews([])).resolves.toEqual({});
		expect(console.warn).not.toHaveBeenCalled();
	});

	it("일부 slug 실패해도 나머지는 반환", async () => {
		seedMockView("good", 7);
		server.use(
			http.get("/api/views", ({ request }) => {
				const slug = new URL(request.url).searchParams.get("slug");
				if (slug === "bad") {
					return HttpResponse.json({ error: "boom" }, { status: 500 });
				}
				if (slug === "good") {
					return HttpResponse.json({ views: 7 });
				}
				return HttpResponse.json({ views: 0 });
			})
		);
		await expect(getBatchPostViews(["good", "bad"])).resolves.toEqual({
			good: 7,
			bad: 0
		});
	});

	it("중복 slug는 같은 값으로 압축", async () => {
		seedMockView("dup", 9);
		await expect(getBatchPostViews(["dup", "dup"])).resolves.toEqual({
			dup: 9
		});
		expect(console.warn).not.toHaveBeenCalled();
	});
});
