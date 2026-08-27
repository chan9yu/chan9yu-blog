import { ChevronRight } from "lucide-react";
import Link from "next/link";

import type { PostSummary } from "@/entities/post";
import type { Series } from "@/entities/series";

type TrendingSeriesProps = {
	series: Series<PostSummary>[];
};

export function TrendingSeries({ series }: TrendingSeriesProps) {
	if (series.length === 0) {
		return <p className="text-muted-foreground text-sm">아직 시리즈가 없습니다.</p>;
	}

	return (
		<ul className="space-y-3">
			{series.map((item) => (
				<li key={item.slug}>
					<Link
						href={`/series/${item.slug}`}
						className="group focus-visible:ring-ring relative -my-1 flex items-center justify-between gap-3 rounded py-1 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
					>
						<ChevronRight
							className="text-accent absolute top-1/2 left-0 size-3.5 -translate-y-1/2 opacity-0 transition duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:-translate-x-1.5 motion-safe:group-hover:translate-x-0 motion-safe:group-focus-visible:translate-x-0"
							aria-hidden
						/>
						<span className="text-card-foreground group-hover:text-accent group-focus-visible:text-accent line-clamp-1 text-sm font-medium transition duration-200 motion-safe:group-hover:translate-x-5 motion-safe:group-focus-visible:translate-x-5">
							{item.name}
						</span>
						<span className="text-muted-foreground shrink-0 text-xs tabular-nums">{item.posts.length}편</span>
					</Link>
				</li>
			))}
		</ul>
	);
}
