"use client";

import { useEffect, useRef, useState } from "react";

import type { PostSummary } from "@/entities/post";
import { EmptyState } from "@/shared/ui/EmptyState";

import type { ViewMode } from "./PostViewSwap";
import { PostViewSwap } from "./PostViewSwap";
import { ViewToggle } from "./ViewToggle";

const PAGE_SIZE = 30;

type PostListProps = {
	posts: PostSummary[];
	countLabel?: string;
};

export function PostList({ posts, countLabel }: PostListProps) {
	const [view, setView] = useState<ViewMode>("grid");
	const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
	const sentinelRef = useRef<HTMLDivElement>(null);

	const visiblePosts = posts.slice(0, displayCount);
	const hasMore = visiblePosts.length < posts.length;

	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel || !hasMore) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) {
					setDisplayCount((prev) => prev + PAGE_SIZE);
				}
			},
			{ rootMargin: "200px" }
		);

		observer.observe(sentinel);

		return () => {
			observer.disconnect();
		};
	}, [hasMore]);

	if (posts.length === 0) {
		return <EmptyState title="조건에 맞는 글이 없습니다." description="태그를 바꾸거나 전체 목록에서 찾아보세요." />;
	}

	return (
		<div>
			<h2 className="sr-only">포스트 목록</h2>
			<div className="mb-3.5 flex items-center justify-between gap-4">
				<p aria-hidden className="text-text-tertiary text-xs">
					{countLabel ?? `${posts.length}개의 포스트`}
				</p>
				<div className="hidden lg:block">
					<ViewToggle value={view} onChange={setView} />
				</div>
			</div>

			<PostViewSwap posts={visiblePosts} view={view} />

			{hasMore && <div ref={sentinelRef} aria-hidden className="h-1" />}
		</div>
	);
}
