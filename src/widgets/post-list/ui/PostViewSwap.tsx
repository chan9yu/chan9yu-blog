import type { PostSummary } from "@/entities/post";
import { PostCard, PostRow } from "@/entities/post";
import { cn } from "@/shared/lib/cn";

import type { ViewMode } from "../model/useViewMode";

type PostViewSwapProps = {
	posts: PostSummary[];
	view: ViewMode;
};

export function PostViewSwap({ posts, view }: PostViewSwapProps) {
	return (
		<>
			<span role="status" aria-live="polite" className="sr-only">
				{view === "list" ? "리스트 보기로 전환됨" : "격자 보기로 전환됨"}
			</span>
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
		</>
	);
}
