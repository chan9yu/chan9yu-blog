"use client";

import { Search, X } from "lucide-react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useId } from "react";

import type { PostSummary } from "@/entities/post";
import { Dialog } from "@/shared/ui/Dialog";

import { useSearch } from "../model/useSearch";
import { SearchResultItem } from "./SearchResultItem";
import { SearchSuggestions } from "./SearchSuggestions";

type SearchModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	posts: PostSummary[];
};

type SearchPhase = "idle" | "pending" | "empty" | "results";

export function SearchModal({ open, onOpenChange, posts }: SearchModalProps) {
	const { query, debouncedQuery, setQuery, results } = useSearch({ posts });
	const titleId = useId();

	const trimmed = debouncedQuery.trim();
	const hasPendingInput = query.trim() !== "" && trimmed === "";
	const phase: SearchPhase = hasPendingInput
		? "pending"
		: trimmed === ""
			? "idle"
			: results.length === 0
				? "empty"
				: "results";

	const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value);
	};

	const handleClose = () => {
		onOpenChange(false);
		setQuery("");
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
			data-align="start"
			panelClassName="bg-card border-border-subtle w-full max-w-150 overflow-hidden rounded-modal border"
		>
			<h2 id={titleId} className="sr-only">
				포스트 검색
			</h2>
			<p className="sr-only">제목과 설명, 태그로 포스트를 검색합니다.</p>

			<div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
				{phase === "pending" && "검색 중"}
				{phase === "empty" && "검색 결과 없음"}
				{phase === "results" && `검색 결과 ${results.length}개`}
			</div>

			<div className="border-border-control flex min-h-14 items-center gap-3 border-b px-4">
				<Search className="text-muted-foreground size-4.5 shrink-0" aria-hidden />
				<input
					type="text"
					autoFocus
					placeholder="포스트, 시리즈, 태그 검색"
					value={query}
					onChange={handleQueryChange}
					aria-label="검색어"
					className="text-foreground placeholder:text-muted-foreground text-15 min-h-11 min-w-0 flex-1 bg-transparent outline-none"
				/>
				<span
					aria-hidden
					className="border-border-subtle text-muted-foreground w420:inline-flex text-11 hidden h-6 shrink-0 items-center rounded-sm border px-2"
				>
					ESC
				</span>
				<button
					type="button"
					onClick={handleClose}
					className="text-muted-foreground hover:text-foreground w420:hidden flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors"
					aria-label="검색 닫기"
				>
					<X className="size-4" aria-hidden />
				</button>
			</div>

			<div className="max-h-search-results overflow-y-auto">
				{phase === "pending" && (
					<div className="text-muted-foreground flex items-center justify-center py-12 text-center text-sm">
						검색 중...
					</div>
				)}
				{phase === "idle" && <SearchSuggestions posts={posts} onSelect={handleClose} />}
				{phase === "empty" && (
					<p className="text-muted-foreground text-13 leading-prose px-5 py-9 text-center">
						{`"${trimmed}"에 해당하는 글이 없습니다.`}
						<br />
						태그 목록에서 주제별로 찾아보세요.
					</p>
				)}
				{phase === "results" && (
					<ul key={trimmed} className="animate-fade-in" aria-label="검색 결과">
						{results.map((result) => (
							<li key={result.post.slug}>
								<SearchResultItem result={result} onSelect={handleClose} />
							</li>
						))}
					</ul>
				)}
			</div>

			<div className="border-border-subtle bg-bg-subtle text-muted-foreground text-11 flex items-center justify-between gap-3 border-t px-4 py-2.5">
				<span>위아래로 이동, Enter로 열기</span>
				<span className="tabular-nums">총 {posts.length}개의 포스트</span>
			</div>
		</Dialog>
	);
}
