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
						className="group focus-visible:ring-ring group-hover:text-accent flex items-center justify-between gap-3 rounded transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
					>
						<span className="text-card-foreground group-hover:text-accent group-focus-visible:text-accent line-clamp-1 text-sm font-medium transition-colors">
							{item.name}
						</span>
						<span className="text-muted-foreground shrink-0 text-xs tabular-nums">{item.posts.length}편</span>
					</Link>
				</li>
			))}
		</ul>
	);
}
