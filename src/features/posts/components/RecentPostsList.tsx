"use client";

import type { PostSummary } from "@/shared/types";
import { cn } from "@/shared/utils/cn";

import { useViewMode } from "../hooks/useViewMode";
import { PostCard } from "./PostCard";
import { PostRow } from "./PostRow";
import { ViewToggle } from "./ViewToggle";

type RecentPostsListProps = {
	posts: PostSummary[];
};

export function RecentPostsList({ posts }: RecentPostsListProps) {
	const { view } = useViewMode();

	return (
		<div className="space-y-4 sm:space-y-5">
			<span role="status" aria-live="polite" className="sr-only">
				{view === "list" ? "리스트 보기로 전환됨" : "격자 보기로 전환됨"}
			</span>
			<div className="flex justify-end">
				<ViewToggle />
			</div>
			<div
				key={view}
				data-view-swap=""
				className={cn(view === "list" ? "flex flex-col gap-4" : "grid-cards grid gap-5")}
			>
				{posts.map((post) => (
					<div key={post.slug} data-card-reveal="">
						{view === "list" ? <PostRow post={post} /> : <PostCard post={post} />}
					</div>
				))}
			</div>
		</div>
	);
}
