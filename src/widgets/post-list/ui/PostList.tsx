"use client";

import { useEffect, useRef, useState } from "react";

import type { PostSummary } from "@/entities/post";
import { EmptyState } from "@/shared/ui/EmptyState";

import { useViewMode } from "../model/useViewMode";
import { PostViewSwap } from "./PostViewSwap";
import { ViewToggle } from "./ViewToggle";

const PAGE_SIZE = 12;

type PostListProps = {
	posts: PostSummary[];
};

export function PostList({ posts }: PostListProps) {
	const { view } = useViewMode();
	const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
	const sentinelRef = useRef<HTMLDivElement>(null);
	const rafRef = useRef<number | undefined>(undefined);

	const visiblePosts = posts.slice(0, displayCount);
	const hasMore = visiblePosts.length < posts.length;

	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel || !hasMore) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) {
					if (rafRef.current !== undefined) {
						cancelAnimationFrame(rafRef.current);
					}
					rafRef.current = requestAnimationFrame(() => {
						setDisplayCount((prev) => prev + PAGE_SIZE);
						rafRef.current = undefined;
					});
				}
			},
			{ rootMargin: "200px" }
		);

		observer.observe(sentinel);

		return () => {
			observer.disconnect();
			if (rafRef.current !== undefined) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, [hasMore]);

	if (posts.length === 0) {
		return <EmptyState title="조건에 맞는 글이 없습니다." description="태그를 바꾸거나 전체 목록에서 찾아보세요." />;
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-end">
				<ViewToggle />
			</div>

			<PostViewSwap posts={visiblePosts} view={view} />

			{hasMore && <div ref={sentinelRef} aria-hidden className="h-1" />}
		</div>
	);
}
