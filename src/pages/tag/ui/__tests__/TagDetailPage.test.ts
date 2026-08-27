/** @vitest-environment node */
import { describe, expect, it, vi } from "vitest";

import type { PostSummary } from "@/entities/post";

const makePost = (slug: string, title: string, tags: string[]): PostSummary => ({
	title,
	description: `${slug} 설명입니다.`,
	slug,
	date: "2026-01-01",
	private: false,
	tags,
	thumbnail: null,
	series: null,
	seriesOrder: null,
	readingTimeMinutes: 1
});

const LONG_TITLE = "긴".repeat(200);

const MANY_TITLES = [
	"첫 번째 글은 무한 스크롤 목록에서 스크롤 위치와 상태를 복원하는 방법을 다룬다",
	"두 번째 글은 서버 컴포넌트 경계 너머로 데이터를 안전하게 넘기는 방법을 다룬다",
	"세 번째 글은 이미지 최적화와 레이아웃 이동을 줄이는 방법을 차례로 다룬다",
	"네 번째 글은 빌드 타임 검증으로 잘못된 배포를 멈추는 방법을 다룬다"
];

const posts: PostSummary[] = [
	makePost("react-render", "리액트 렌더링 파헤치기", ["react"]),
	makePost("react-fiber", "Fiber 구조 정리", ["react"]),
	makePost("webrtc-order", "WebRTC 연결 순서", ["webrtc"]),
	makePost("long-a", LONG_TITLE, ["장문"]),
	makePost("long-b", "짧은 제목", ["장문"]),
	...MANY_TITLES.map((title, index) => makePost(`many-${index}`, title, ["many"]))
];

vi.mock("@/entities/post/index.server", () => ({
	getPublicPosts: () => posts,
	resolvePostThumbnails: (list: PostSummary[]) => list
}));

const { generateMetadata } = await import("../TagDetailPage");

const metadataFor = (tag: string) => generateMetadata({ params: Promise.resolve({ tag }) });

describe("태그 상세 generateMetadata", () => {
	it("description에 그 태그의 최신 글 제목을 담는다", async () => {
		const meta = await metadataFor("react");

		expect(meta.description).toBe("react 태그 글 2편. 리액트 렌더링 파헤치기, Fiber 구조 정리");
	});

	it("160자를 넘기지 않고 제목 경계에서 멈춘다 (첫 제목부터 넘으면 글 수만 낸다)", async () => {
		const meta = await metadataFor("many");
		const description = meta.description ?? "";
		const included = MANY_TITLES.filter((title) => description.includes(title));

		expect(description.length).toBeLessThanOrEqual(160);
		expect(included.length).toBeGreaterThan(0);
		expect(included.length).toBeLessThan(MANY_TITLES.length);
		expect(description.endsWith(included[included.length - 1] ?? "")).toBe(true);

		const longMeta = await metadataFor("장문");

		expect(longMeta.description).toBe("장문 태그 글 2편.");
	});

	it("글이 TAG_INDEX_MIN_POSTS 미만이면 noindex로 두되 링크는 따라가게 하고, 이상이면 막지 않는다", async () => {
		const under = await metadataFor("webrtc");
		const over = await metadataFor("react");

		expect(under.robots).toEqual({ index: false, follow: true });
		expect(over.robots).toBeUndefined();
	});

	it("글이 없는 태그는 404 metadata를 돌려준다", async () => {
		const meta = await metadataFor("없는태그");

		expect(meta.title).toBe("404 Not Found");
		expect(meta.robots).toEqual({ index: false, follow: false });
	});
});
