import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import type { AdjacentPosts } from "@/entities/post";

type PostNavigationProps = {
	adjacent: AdjacentPosts;
};

export function PostNavigation({ adjacent }: PostNavigationProps) {
	const { prev, next } = adjacent;
	if (!prev && !next) return null;

	return (
		<nav aria-label="이전/다음 포스트" className="mt-14 grid grid-cols-1 gap-3 lg:grid-cols-2">
			{prev ? (
				<Link
					href={`/posts/${prev.slug}`}
					className="group bg-card border-border-subtle focus-visible:ring-ring hover:border-accent/40 flex min-h-11 flex-col gap-2 rounded-lg border p-4.5 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
				>
					<span className="text-muted-foreground text-chip flex items-center gap-1.5 font-medium">
						<ChevronLeft className="size-3.5" aria-hidden />
						이전 글
					</span>
					<span className="text-foreground group-hover:text-accent text-14 line-clamp-2 leading-snug font-semibold text-balance break-keep transition-colors">
						{prev.title}
					</span>
				</Link>
			) : (
				<div aria-hidden />
			)}

			{next ? (
				<Link
					href={`/posts/${next.slug}`}
					className="group bg-card border-border-subtle focus-visible:ring-ring hover:border-accent/40 flex min-h-11 flex-col gap-2 rounded-lg border p-4.5 text-right transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
				>
					<span className="text-muted-foreground text-chip flex items-center justify-end gap-1.5 font-medium">
						다음 글
						<ChevronRight className="size-3.5" aria-hidden />
					</span>
					<span className="text-foreground group-hover:text-accent text-14 line-clamp-2 leading-snug font-semibold text-balance break-keep transition-colors">
						{next.title}
					</span>
				</Link>
			) : (
				<div aria-hidden />
			)}
		</nav>
	);
}
