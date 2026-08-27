import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { seedMockView } from "@/shared/test/msw/handlers";
import { server } from "@/shared/test/msw/server";

import { fetchPostViewsOrNull, incrementPostViews } from "../kv-client";

beforeEach(() => {
	vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe("fetchPostViewsOrNull", () => {
	it("저장된 slug는 그 값, 미등록 slug는 0. 실패가 아니라 조회수가 실제로 0인 상태다", async () => {
		seedMockView("react-19-use", 42);

		await expect(fetchPostViewsOrNull("react-19-use")).resolves.toBe(42);
		await expect(fetchPostViewsOrNull("never-seen")).resolves.toBe(0);
		expect(console.warn).not.toHaveBeenCalled();
	});

	it("서버 에러는 null. 0으로 감추지 않는다", async () => {
		server.use(http.get("/api/views", () => HttpResponse.json({ error: "internal" }, { status: 500 })));
		await expect(fetchPostViewsOrNull("any")).resolves.toBeNull();
		expect(console.warn).toHaveBeenCalled();
	});

	it("네트워크 에러는 null", async () => {
		server.use(http.get("/api/views", () => HttpResponse.error()));
		await expect(fetchPostViewsOrNull("any")).resolves.toBeNull();
		expect(console.warn).toHaveBeenCalled();
	});

	it("응답 shape가 깨지면 null", async () => {
		server.use(http.get("/api/views", () => HttpResponse.json({ wrong: "payload" })));
		await expect(fetchPostViewsOrNull("any")).resolves.toBeNull();
		expect(console.warn).toHaveBeenCalled();
	});
});

describe("incrementPostViews", () => {
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
