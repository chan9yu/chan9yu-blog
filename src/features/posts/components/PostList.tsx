"use client";

import { useEffect, useRef, useState } from "react";

import { EmptyState } from "@/shared/components/common/EmptyState";
import { useHydrated } from "@/shared/hooks/useHydrated";
import type { PostSummary } from "@/shared/types";
import { cn } from "@/shared/utils/cn";

import { useViewMode } from "../hooks/useViewMode";
import { PostCard } from "./PostCard";
import { PostRow } from "./PostRow";
import { ViewToggle } from "./ViewToggle";

const PAGE_SIZE = 12;

type PostListProps = {
	posts: PostSummary[];
};

export function PostList({ posts }: PostListProps) {
	const { view } = useViewMode();
	const hydrated = useHydrated();
	const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
	const sentinelRef = useRef<HTMLDivElement>(null);
	const rafRef = useRef<number | undefined>(undefined);

	const effectiveView = hydrated ? view : "grid";
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

			<div
				key={effectiveView}
				data-view-swap=""
				className={cn(effectiveView === "list" ? "flex flex-col gap-4" : "grid-cards grid gap-5")}
			>
				{visiblePosts.map((post) => (
					<div key={post.slug} data-card-reveal="">
						{effectiveView === "list" ? <PostRow post={post} /> : <PostCard post={post} />}
					</div>
				))}
			</div>

			{hasMore && <div ref={sentinelRef} aria-hidden className="h-1" />}
		</div>
	);
}
