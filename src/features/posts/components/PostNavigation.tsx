import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import type { AdjacentPosts } from "@/shared/types";

type PostNavigationProps = {
	adjacent: AdjacentPosts;
};

export function PostNavigation({ adjacent }: PostNavigationProps) {
	const { prev, next } = adjacent;
	if (!prev && !next) return null;

	return (
		<nav aria-label="이전/다음 포스트" className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-2">
			{prev ? (
				<Link
					href={`/posts/${prev.slug}`}
					className="group bg-card border-border-subtle focus-visible:ring-ring hover:border-accent/40 flex min-h-11 flex-col gap-1.5 rounded-lg border p-4 transition-[border-color] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:gap-2 sm:p-6"
				>
					<span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium sm:gap-2 sm:text-sm">
						<ChevronLeft className="size-3.5 sm:size-4" aria-hidden />
						이전 글
					</span>
					<h3 className="text-foreground group-hover:text-accent line-clamp-2 text-sm font-semibold text-balance break-keep transition-colors sm:text-base">
						{prev.title}
					</h3>
				</Link>
			) : (
				<div aria-hidden />
			)}

			{next ? (
				<Link
					href={`/posts/${next.slug}`}
					className="group bg-card border-border-subtle focus-visible:ring-ring hover:border-accent/40 flex min-h-11 flex-col gap-1.5 rounded-lg border p-4 text-right transition-[border-color] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:gap-2 sm:p-6"
				>
					<span className="text-muted-foreground flex items-center justify-end gap-1.5 text-xs font-medium sm:gap-2 sm:text-sm">
						다음 글
						<ChevronRight className="size-3.5 sm:size-4" aria-hidden />
					</span>
					<h3 className="text-foreground group-hover:text-accent line-clamp-2 text-sm font-semibold text-balance break-keep transition-colors sm:text-base">
						{next.title}
					</h3>
				</Link>
			) : (
				<div aria-hidden />
			)}
		</nav>
	);
}
