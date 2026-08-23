"use client";

import type { PostSummary } from "@/entities/post";

import { useViewMode } from "../model/useViewMode";
import { PostViewSwap } from "./PostViewSwap";
import { ViewToggle } from "./ViewToggle";

type RecentPostsListProps = {
	posts: PostSummary[];
};

export function RecentPostsList({ posts }: RecentPostsListProps) {
	const { view } = useViewMode();

	return (
		<div className="space-y-4 sm:space-y-5">
			<div className="flex justify-end">
				<ViewToggle />
			</div>
			<PostViewSwap posts={posts} view={view} />
		</div>
	);
}
