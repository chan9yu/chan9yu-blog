import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { PostSummary } from "@/shared/types";

import { PostList } from "../PostList";

class StubIntersectionObserver {
	observe() {}
	disconnect() {}
	unobserve() {}
}

beforeEach(() => {
	vi.stubGlobal("IntersectionObserver", StubIntersectionObserver);
});

afterEach(() => {
	vi.unstubAllGlobals();
});

function makePost(overrides: Partial<PostSummary> = {}): PostSummary {
	return {
		slug: "sample-post",
		title: "샘플 포스트",
		description: "이것은 샘플 포스트 설명입니다.",
		date: "2026-04-20",
		tags: ["react", "nextjs"],
		private: false,
		thumbnail: null,
		series: null,
		seriesOrder: null,
		readingTimeMinutes: 5,
		...overrides
	};
}

describe("PostList", () => {
	it("빈 배열 → 안내 메시지 (role=status)", () => {
		render(<PostList posts={[]} />);
		expect(screen.getByRole("status")).toHaveTextContent(/글이 없습니다/);
	});

	it("포스트 배열 → 각 카드는 /posts/{slug} 링크", () => {
		const posts = [makePost({ slug: "post-a", title: "포스트 A" }), makePost({ slug: "post-b", title: "포스트 B" })];

		render(<PostList posts={posts} />);

		const linkA = screen.getByRole("link", { name: /포스트 A/ });
		const linkB = screen.getByRole("link", { name: /포스트 B/ });
		expect(linkA).toHaveAttribute("href", "/posts/post-a");
		expect(linkB).toHaveAttribute("href", "/posts/post-b");
	});

	it("카드에 제목·설명·reading time·태그 표시", () => {
		const post = makePost({
			title: "유니크 제목",
			description: "유니크 설명",
			tags: ["typescript", "testing"],
			readingTimeMinutes: 7
		});

		render(<PostList posts={[post]} />);

		const card = screen.getByRole("link", { name: /유니크 제목/ });
		expect(within(card).getByText("유니크 제목")).toBeInTheDocument();
		expect(within(card).getByText("유니크 설명")).toBeInTheDocument();
		expect(within(card).getByText(/읽는 시간 7분/)).toBeInTheDocument();
		expect(within(card).getByText("typescript")).toBeInTheDocument();
	});

	it("썸네일이 있는 포스트는 <img> 렌더 (카드 제목이 링크 이름을 담당하므로 alt는 비운다)", () => {
		const post = makePost({ thumbnail: "/posts/sample/images/thumb.png", title: "썸네일 있음" });
		const { container } = render(<PostList posts={[post]} />);

		const img = container.querySelector("img");
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute("alt", "");
	});

	it("최초 12개까지만 표시 (페이지 크기, 무한 스크롤 전)", () => {
		const posts = Array.from({ length: 20 }, (_, i) =>
			makePost({ slug: `post-${i}`, title: `포스트 ${i}`, description: `설명 ${i}` })
		);

		render(<PostList posts={posts} />);

		const links = screen.getAllByRole("link");
		expect(links.length).toBe(12);
		expect(screen.getByRole("link", { name: /포스트 11/ })).toBeInTheDocument();
		expect(screen.queryByRole("link", { name: /포스트 12/ })).not.toBeInTheDocument();
	});

	it("ViewToggle 컨트롤 존재 (리스트/격자 전환 버튼)", () => {
		render(<PostList posts={[makePost()]} />);
		const toolbar = screen.getByRole("toolbar", { name: "뷰 모드" });
		expect(within(toolbar).getByRole("button", { name: "리스트 보기" })).toBeInTheDocument();
		expect(within(toolbar).getByRole("button", { name: "격자 보기" })).toBeInTheDocument();
	});
});
