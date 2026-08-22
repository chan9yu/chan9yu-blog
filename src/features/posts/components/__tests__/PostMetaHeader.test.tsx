import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { PostSummary } from "@/shared/types";

import { PostMetaHeader } from "../PostMetaHeader";

function makePost(overrides: Partial<PostSummary> = {}): PostSummary {
	return {
		slug: "post-sample",
		title: "샘플 포스트 제목",
		description: "샘플 포스트 설명 문장입니다.",
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

describe("PostMetaHeader", () => {
	it("h1 제목 + 설명 + 날짜 datetime 표시", () => {
		render(<PostMetaHeader post={makePost({ title: "유니크 제목", description: "유니크 설명" })} />);

		expect(screen.getByRole("heading", { level: 1, name: "유니크 제목" })).toBeInTheDocument();
		expect(screen.getByText("유니크 설명")).toBeInTheDocument();
		const time = screen.getByText(/2026/, { selector: "time" });
		expect(time).toHaveAttribute("datetime", "2026-04-20");
	});

	it("태그 목록 Link는 /tags/{tag} href", () => {
		render(<PostMetaHeader post={makePost({ tags: ["react", "testing"] })} />);

		const tagList = screen.getByRole("list", { name: "태그" });
		const items = within(tagList).getAllByRole("listitem");
		expect(items.length).toBe(2);

		const reactLink = within(items[0]!).getByRole("link", { name: /react/ });
		expect(reactLink).toHaveAttribute("href", "/tags/react");

		const testingLink = within(items[1]!).getByRole("link", { name: /testing/ });
		expect(testingLink).toHaveAttribute("href", "/tags/testing");
	});

	it("한글 태그는 raw slug로 href 유지 (decodeURIComponent 경로 대응)", () => {
		render(<PostMetaHeader post={makePost({ tags: ["항해99"] })} />);

		const link = screen.getByRole("link", { name: /항해99/ });
		expect(link).toHaveAttribute("href", "/tags/항해99");
	});

	it("빈 tags → 태그 ul 자체 비렌더", () => {
		render(<PostMetaHeader post={makePost({ tags: [] })} />);

		expect(screen.queryByRole("list", { name: "태그" })).not.toBeInTheDocument();
	});

	it("viewCounterSlot에 주입된 노드 렌더", () => {
		render(<PostMetaHeader post={makePost()} viewCounterSlot={<span data-testid="vc">조회수 42</span>} />);

		expect(screen.getByTestId("vc")).toHaveTextContent("조회수 42");
	});

	it("shareSlot에 주입된 노드 렌더", () => {
		render(<PostMetaHeader post={makePost()} shareSlot={<button type="button">공유</button>} />);

		expect(screen.getByRole("button", { name: "공유" })).toBeInTheDocument();
	});
});
