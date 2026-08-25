"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import type { PostSummary } from "@/entities/post";
import { SectionTitle } from "@/shared/ui/SectionTitle";

import type { ViewMode } from "./PostViewSwap";
import { PostViewSwap } from "./PostViewSwap";
import { ViewToggle } from "./ViewToggle";

type RecentPostsListProps = {
	posts: PostSummary[];
	title: ReactNode;
	titleId?: string;
	footer?: ReactNode;
};

export function RecentPostsList({ posts, title, titleId, footer }: RecentPostsListProps) {
	const [view, setView] = useState<ViewMode>("grid");

	return (
		<div className="space-y-4.5">
			<SectionTitle
				id={titleId}
				action={
					<div className="hidden lg:block">
						<ViewToggle value={view} onChange={setView} />
					</div>
				}
			>
				{title}
			</SectionTitle>

			<PostViewSwap posts={posts} view={view} />

			{footer}
		</div>
	);
}
