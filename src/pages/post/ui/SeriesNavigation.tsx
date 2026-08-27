import { BookOpen, ChevronLeft, ChevronRight, List } from "lucide-react";
import Link from "next/link";

import type { PostSummary } from "@/entities/post";
import type { Series } from "@/entities/series";
import { getAdjacentInSeries } from "@/entities/series";

type SeriesNavigationProps = {
	series: Series<PostSummary>;
	currentSlug: string;
};

export function SeriesNavigation({ series, currentSlug }: SeriesNavigationProps) {
	const { prev, next, order, total } = getAdjacentInSeries(series, currentSlug);
	if (order === null) return null;

	return (
		<aside aria-label="시리즈 안내" className="bg-muted border-border-subtle space-y-4 rounded-lg border p-6">
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<div className="bg-card flex size-8 items-center justify-center rounded-lg">
						<BookOpen className="text-accent size-4" aria-hidden />
					</div>
					<div>
						<p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">시리즈</p>
						<Link
							href={`/series/${series.slug}`}
							className="text-foreground hover:text-accent focus-visible:text-accent -my-1 inline-block py-1 font-semibold transition-colors focus-visible:outline-none"
						>
							{series.name}
						</Link>
					</div>
				</div>
				<span className="text-muted-foreground shrink-0 text-sm font-medium tabular-nums">
					{order} / {total}
				</span>
			</div>

			<div className="flex gap-3">
				{prev ? (
					<Link
						href={`/posts/${prev.slug}`}
						className="group bg-card border-border-subtle focus-visible:ring-ring hover:border-accent/40 flex flex-1 flex-col gap-1 rounded-lg border p-3 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
					>
						<span className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
							<ChevronLeft className="size-3" aria-hidden />
							이전 글
						</span>
						<span className="text-foreground group-hover:text-accent line-clamp-1 text-sm font-medium transition-colors">
							{prev.title}
						</span>
					</Link>
				) : (
					<div className="bg-card border-border-subtle flex flex-1 flex-col gap-1 rounded-lg border p-3 opacity-80">
						<span className="text-muted-foreground text-xs font-medium">이전 글</span>
						<span className="text-muted-foreground text-sm">첫 번째 글입니다</span>
					</div>
				)}

				{next ? (
					<Link
						href={`/posts/${next.slug}`}
						className="group bg-card border-border-subtle focus-visible:ring-ring hover:border-accent/40 flex flex-1 flex-col gap-1 rounded-lg border p-3 text-right transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
					>
						<span className="text-muted-foreground flex items-center justify-end gap-1 text-xs font-medium">
							다음 글
							<ChevronRight className="size-3" aria-hidden />
						</span>
						<span className="text-foreground group-hover:text-accent line-clamp-1 text-sm font-medium transition-colors">
							{next.title}
						</span>
					</Link>
				) : (
					<div className="bg-card border-border-subtle flex flex-1 flex-col gap-1 rounded-lg border p-3 text-right opacity-80">
						<span className="text-muted-foreground text-xs font-medium">다음 글</span>
						<span className="text-muted-foreground text-sm">마지막 글입니다</span>
					</div>
				)}
			</div>

			<Link
				href={`/series/${series.slug}`}
				className="bg-card border-border-subtle text-muted-foreground hover:text-foreground focus-visible:ring-ring hover:border-accent/40 flex items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
			>
				<List className="size-4" aria-hidden />
				시리즈 전체 보기
			</Link>
		</aside>
	);
}
