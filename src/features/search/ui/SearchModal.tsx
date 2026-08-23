"use client";

import { Search, X } from "lucide-react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useId } from "react";

import type { PostSummary } from "@/entities/post";
import { Dialog } from "@/shared/ui/Dialog";
import { EmptyState } from "@/shared/ui/EmptyState";

import { useSearch } from "../model/useSearch";
import { SearchResultItem } from "./SearchResultItem";
import { SearchSuggestions } from "./SearchSuggestions";

type SearchModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	posts: PostSummary[];
};

export function SearchModal({ open, onOpenChange, posts }: SearchModalProps) {
	const { query, debouncedQuery, setQuery, results } = useSearch({ posts });
	const titleId = useId();

	const trimmed = debouncedQuery.trim();
	const hasPendingInput = query.trim() !== "" && trimmed === "";

	const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value);
	};

	const handleClose = () => {
		onOpenChange(false);
		setQuery("");
	};

	const handleSelect = () => {
		onOpenChange(false);
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
		if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

		const links = Array.from(event.currentTarget.querySelectorAll<HTMLAnchorElement>("a[href]"));
		if (links.length === 0) return;

		const activeIndex = links.findIndex((link) => link === document.activeElement);
		const lastIndex = links.length - 1;

		if (event.key === "ArrowUp" && activeIndex < 0) return;

		event.preventDefault();
		let nextIndex: number;
		if (event.key === "ArrowDown") {
			nextIndex = activeIndex < 0 || activeIndex >= lastIndex ? 0 : activeIndex + 1;
		} else {
			nextIndex = activeIndex <= 0 ? lastIndex : activeIndex - 1;
		}

		links[nextIndex]?.focus();
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			onKeyDown={handleKeyDown}
			aria-labelledby={titleId}
			className="items-start"
			panelClassName="bg-background border-border-subtle mt-modal w-full max-w-2xl overflow-hidden rounded-lg border"
		>
			<h2 id={titleId} className="sr-only">
				포스트 검색
			</h2>
			<p className="sr-only">제목과 설명, 태그로 포스트를 검색합니다.</p>

			<div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
				{hasPendingInput
					? "검색 중"
					: trimmed === ""
						? ""
						: results.length === 0
							? "검색 결과 없음"
							: `검색 결과 ${results.length}개`}
			</div>

			<div className="border-border-subtle flex items-center gap-3 border-b px-4 py-4">
				<Search className="text-muted-foreground size-5 shrink-0" aria-hidden />
				<input
					type="text"
					autoFocus
					placeholder="포스트 검색... (제목, 내용, 태그)"
					value={query}
					onChange={handleQueryChange}
					aria-label="검색어"
					className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent text-base transition-opacity outline-none focus:placeholder:opacity-50"
				/>
				<button
					type="button"
					onClick={handleClose}
					className="text-muted-foreground hover:text-foreground flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors"
					aria-label="검색 닫기"
				>
					<X className="size-4" aria-hidden />
				</button>
			</div>

			<div className="max-h-modal-content overflow-y-auto p-2">
				{trimmed === "" ? (
					hasPendingInput ? (
						<div className="text-muted-foreground flex items-center justify-center py-12 text-center text-sm">
							검색 중...
						</div>
					) : (
						<SearchSuggestions posts={posts} onSelect={handleSelect} />
					)
				) : results.length === 0 ? (
					<EmptyState
						title="검색 결과가 없습니다"
						description="다른 검색어를 넣거나 태그 목록에서 주제별로 찾아보세요."
						className="border-0 bg-transparent"
					/>
				) : (
					<ul key={trimmed} className="animate-fade-in space-y-1" aria-label="검색 결과">
						{results.map((result) => (
							<li key={result.post.slug}>
								<SearchResultItem result={result} onSelect={handleSelect} />
							</li>
						))}
					</ul>
				)}
			</div>

			{query.trim() === "" && (
				<div className="border-border-subtle text-muted-foreground border-t px-4 py-3 text-xs">
					<div className="flex items-center justify-between">
						<span>
							<kbd className="bg-muted rounded px-2 py-1 font-mono">ESC</kbd>&nbsp;를 눌러 닫기
						</span>
						<span>총 {posts.length}개의 포스트</span>
					</div>
				</div>
			)}
		</Dialog>
	);
}
