import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { PostSummary } from "@/entities/post";

import { useSearch } from "../useSearch";

const postBase = {
	date: "2026-01-01",
	private: false,
	thumbnail: null,
	series: null,
	seriesOrder: null,
	readingTimeMinutes: 5
} as const;

const posts: PostSummary[] = [
	{
		...postBase,
		slug: "react-19-features",
		title: "React 19 새로운 기능 정리",
		description: "useOptimistic, useActionState 등을 훑어본다",
		tags: ["react", "hooks"]
	},
	{
		...postBase,
		slug: "typescript-strict-mode",
		title: "TypeScript strict mode 전환 가이드",
		description: "any를 제거하고 타입 안전성을 확보하는 법",
		tags: ["typescript"]
	},
	{
		...postBase,
		slug: "nextjs-16-app-router",
		title: "Next.js 16 App Router 심층 분석",
		description: "React 19 서버 컴포넌트와의 통합",
		tags: ["nextjs", "react"]
	},
	{
		...postBase,
		slug: "tailwind-tokens",
		title: "Tailwind 4 Semantic 토큰 설계",
		description: "디자인 시스템과 CSS 변수 연결",
		tags: ["tailwind", "css"]
	}
];

describe("useSearch", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("빈 공백 쿼리에는 결과가 빈 배열이다", () => {
		const { result } = renderHook(() => useSearch({ posts }));

		act(() => {
			result.current.setQuery("   ");
		});
		act(() => {
			vi.advanceTimersByTime(200);
		});

		expect(result.current.results).toEqual([]);
	});

	it("200ms debounce 이후에만 결과가 갱신된다", () => {
		const { result } = renderHook(() => useSearch({ posts }));

		act(() => {
			result.current.setQuery("react");
		});
		expect(result.current.results).toEqual([]);

		act(() => {
			vi.advanceTimersByTime(199);
		});
		expect(result.current.results).toEqual([]);

		act(() => {
			vi.advanceTimersByTime(1);
		});
		expect(result.current.results.length).toBeGreaterThan(0);
	});

	it("태그 매칭도 검색 결과에 포함된다", () => {
		const { result } = renderHook(() => useSearch({ posts }));

		act(() => {
			result.current.setQuery("typescript");
		});
		act(() => {
			vi.advanceTimersByTime(200);
		});

		const found = result.current.results.some((item) => item.post.tags.includes("typescript"));
		expect(found).toBe(true);
	});

	it("limit 옵션으로 최대 결과 개수를 제한한다 (기본 10, 지정하면 그 값)", () => {
		const manyPosts: PostSummary[] = Array.from({ length: 15 }, (_, i) => ({
			...postBase,
			slug: `react-post-${i}`,
			title: `React 관련 포스트 ${i}`,
			description: "리액트 개념 설명",
			tags: ["react"]
		}));

		const { result } = renderHook(() => useSearch({ posts: manyPosts }));

		act(() => {
			result.current.setQuery("react");
		});
		act(() => {
			vi.advanceTimersByTime(200);
		});

		expect(result.current.results).toHaveLength(10);

		const { result: limited } = renderHook(() => useSearch({ posts: manyPosts, limit: 3 }));

		act(() => {
			limited.current.setQuery("react");
		});
		act(() => {
			vi.advanceTimersByTime(200);
		});

		expect(limited.current.results).toHaveLength(3);
	});

	it("쿼리가 빠르게 연속 변경되면 마지막 값으로만 debounce 실행된다", () => {
		const { result } = renderHook(() => useSearch({ posts }));

		act(() => {
			result.current.setQuery("typescript");
		});
		act(() => {
			vi.advanceTimersByTime(100);
		});
		act(() => {
			result.current.setQuery("react");
		});
		act(() => {
			vi.advanceTimersByTime(200);
		});

		const first = result.current.results[0];
		expect(first).toBeDefined();
		expect(first?.post.title.toLowerCase()).toContain("react");
	});

	it("쿼리를 빈 문자열로 되돌리면 debounce 없이 즉시 결과가 지워진다", () => {
		const { result } = renderHook(() => useSearch({ posts }));

		act(() => {
			result.current.setQuery("react");
		});
		act(() => {
			vi.advanceTimersByTime(200);
		});
		expect(result.current.results.length).toBeGreaterThan(0);

		act(() => {
			result.current.setQuery("");
		});
		expect(result.current.results).toEqual([]);
	});
});
