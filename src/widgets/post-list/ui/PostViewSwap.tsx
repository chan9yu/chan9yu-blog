import type { CSSProperties } from "react";

import type { PostSummary } from "@/entities/post";
import { PostCard, PostRow } from "@/entities/post";

export type ViewMode = "list" | "grid";

type PostViewSwapProps = {
	posts: PostSummary[];
	view: ViewMode;
};

const CONTAINER_CLASS: Record<ViewMode, string> = {
	list: "flex flex-col gap-3",
	grid: "grid-cards grid gap-3.5 lg:gap-4"
};

export function PostViewSwap({ posts, view }: PostViewSwapProps) {
	return (
		<>
			<span role="status" aria-live="polite" className="sr-only">
				{view === "list" ? "리스트 보기로 전환됨" : "격자 보기로 전환됨"}
			</span>
			<div key={view} data-view-swap="" className={CONTAINER_CLASS[view]}>
				{posts.map((post, index) => (
					<div key={post.slug} data-card-reveal="" style={{ "--card-index": index } as CSSProperties}>
						{view === "list" ? (
							<PostRow post={post} priority={index === 0} />
						) : (
							<PostCard post={post} priority={index === 0} />
						)}
					</div>
				))}
			</div>
		</>
	);
}
