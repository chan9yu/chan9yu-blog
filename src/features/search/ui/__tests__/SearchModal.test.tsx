import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import type { PostSummary } from "@/entities/post";

import { SearchModal } from "../SearchModal";

vi.mock("next/link", () => ({
	default: ({ children, href, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) => (
		<a href={typeof href === "string" ? href : "#"} {...rest}>
			{children}
		</a>
	)
}));

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
		description: "useOptimistic, useActionState 훅 소개",
		tags: ["react", "hooks"]
	},
	{
		...postBase,
		slug: "typescript-strict",
		title: "TypeScript strict mode 가이드",
		description: "any 제거와 타입 안전성 확보",
		tags: ["typescript"]
	},
	{
		...postBase,
		slug: "tailwind-tokens",
		title: "Tailwind 4 Semantic 토큰",
		description: "디자인 시스템 토큰 설계",
		tags: ["tailwind"]
	}
];

describe("SearchModal", () => {
	it("open=true이면 dialog가 렌더되고 input에 autoFocus가 걸린다", async () => {
		render(<SearchModal open={true} onOpenChange={vi.fn()} posts={posts} />);
		const input = await screen.findByLabelText("검색어");
		expect(input).toHaveFocus();
	});

	it("빈 상태에서는 추천 영역(인기 태그·최근 포스트)과 총 포스트 수를 보여준다", async () => {
		render(<SearchModal open={true} onOpenChange={vi.fn()} posts={posts} />);
		expect(await screen.findByRole("heading", { name: /인기 태그/ })).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: /최근 포스트/ })).toBeInTheDocument();
		expect(screen.getByText(new RegExp(`총 ${posts.length}개`))).toBeInTheDocument();
	});

	it("결과가 없을 때 검색어를 되짚어 안내한다", async () => {
		const user = userEvent.setup();
		render(<SearchModal open={true} onOpenChange={vi.fn()} posts={posts} />);

		const input = await screen.findByLabelText("검색어");
		await user.type(input, "zzzzzzzzzz");

		await waitFor(
			() => {
				expect(screen.getByText(/"zzzzzzzzzz"에 해당하는 글이 없습니다/)).toBeInTheDocument();
			},
			{ timeout: 1000 }
		);
	});

	it("결과 항목 클릭 시 onOpenChange(false)로 모달이 닫힌다", async () => {
		const user = userEvent.setup();
		const handleOpenChange = vi.fn();
		render(<SearchModal open={true} onOpenChange={handleOpenChange} posts={posts} />);

		const input = await screen.findByLabelText("검색어");
		await user.type(input, "react");

		const link = await screen.findByRole("link", { name: /React 19 새로운 기능/ }, { timeout: 1000 });
		await user.click(link);

		expect(handleOpenChange).toHaveBeenCalledWith(false);
	});

	it("Escape 키를 누르면 onOpenChange(false)가 호출된다", async () => {
		const user = userEvent.setup();
		const handleOpenChange = vi.fn();
		render(<SearchModal open={true} onOpenChange={handleOpenChange} posts={posts} />);

		await screen.findByLabelText("검색어");
		await user.keyboard("{Escape}");

		expect(handleOpenChange).toHaveBeenCalledWith(false);
	});

	it("ArrowDown으로 첫 번째 결과 링크로 포커스가 이동한다", async () => {
		const user = userEvent.setup();
		render(<SearchModal open={true} onOpenChange={vi.fn()} posts={posts} />);

		const input = await screen.findByLabelText("검색어");
		await user.type(input, "react");

		const firstLink = await screen.findByRole("link", { name: /React 19 새로운 기능/ }, { timeout: 1000 });

		await user.keyboard("{ArrowDown}");
		await waitFor(() => {
			expect(firstLink).toHaveFocus();
		});
	});
});
