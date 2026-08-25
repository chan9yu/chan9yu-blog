import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { PostSummary } from "../../model/post";
import { getTrendingPosts } from "../getTrendingPosts";

const post = (slug: string, date: string): PostSummary => ({
	title: slug,
	description: "desc",
	slug,
	date,
	private: false,
	tags: [],
	thumbnail: null,
	series: null,
	seriesOrder: null,
	readingTimeMinutes: 1
});

const mgetMock = vi.fn();

vi.mock("next/cache", () => ({
	unstable_cache: <T>(fn: T) => fn
}));

vi.mock("@upstash/redis", () => ({
	Redis: {
		fromEnv: () => ({
			mget: (...args: unknown[]) => mgetMock(...args)
		})
	}
}));

describe("getTrendingPosts", () => {
	const originalEnv = { ...process.env };

	beforeEach(() => {
		mgetMock.mockReset();
		process.env.UPSTASH_REDIS_REST_URL = "https://redis.example";
		process.env.UPSTASH_REDIS_REST_TOKEN = "token";
	});

	afterEach(() => {
		process.env = { ...originalEnv };
	});

	it("Redis 조회수 내림차순 상위 N개를 반환한다", async () => {
		mgetMock.mockResolvedValueOnce([10, 50, 30]);
		const posts = [post("a", "2026-01-01"), post("b", "2026-02-01"), post("c", "2026-03-01")];

		const result = await getTrendingPosts(posts, 2);

		expect(result.fallback).toBe(false);
		expect(result.posts.map((p) => p.slug)).toEqual(["b", "c"]);
	});

	it("동률 시 발행일 내림차순으로 정렬한다", async () => {
		mgetMock.mockResolvedValueOnce([10, 10, 10]);
		const posts = [post("older", "2026-01-01"), post("middle", "2026-02-01"), post("newest", "2026-03-01")];

		const result = await getTrendingPosts(posts, 3);

		expect(result.posts.map((p) => p.slug)).toEqual(["newest", "middle", "older"]);
	});

	it("Redis 값이 null이면 0으로 취급한다", async () => {
		mgetMock.mockResolvedValueOnce([null, 5]);
		const posts = [post("a", "2026-02-01"), post("b", "2026-01-01")];

		const result = await getTrendingPosts(posts, 2);

		expect(result.posts.map((p) => p.slug)).toEqual(["b", "a"]);
	});

	it("Redis 환경 변수 미설정 시 date desc fallback을 반환한다", async () => {
		delete process.env.UPSTASH_REDIS_REST_URL;
		delete process.env.UPSTASH_REDIS_REST_TOKEN;
		const posts = [post("newer", "2026-02-01"), post("older", "2026-01-01")];

		const result = await getTrendingPosts(posts, 2);

		expect(result.fallback).toBe(true);
		expect(result.posts.map((p) => p.slug)).toEqual(["newer", "older"]);
		expect(mgetMock).not.toHaveBeenCalled();
	});

	it("Redis 호출이 throw하면 date desc fallback을 반환한다", async () => {
		mgetMock.mockRejectedValueOnce(new Error("Redis upstream error"));
		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
		const posts = [post("a", "2026-02-01"), post("b", "2026-01-01")];

		const result = await getTrendingPosts(posts, 2);

		expect(result.fallback).toBe(true);
		expect(result.posts.map((p) => p.slug)).toEqual(["a", "b"]);
		expect(warnSpy).toHaveBeenCalled();
		warnSpy.mockRestore();
	});

	it("기본 limit은 5다", async () => {
		mgetMock.mockResolvedValueOnce([1, 2, 3, 4, 5, 6, 7]);
		const posts = Array.from({ length: 7 }, (_, i) => post(`p${i}`, `2026-01-0${i + 1}`));

		const result = await getTrendingPosts(posts);

		expect(result.posts).toHaveLength(5);
	});

	it("빈 입력에는 빈 배열과 fallback false를 반환한다", async () => {
		const result = await getTrendingPosts([]);

		expect(result).toEqual({ posts: [], fallback: false });
		expect(mgetMock).not.toHaveBeenCalled();
	});

	it("limit이 입력 수보다 크면 모두 반환한다", async () => {
		mgetMock.mockResolvedValueOnce([1]);
		const posts = [post("a", "2026-01-01")];

		const result = await getTrendingPosts(posts, 10);

		expect(result.posts).toHaveLength(1);
	});
});
