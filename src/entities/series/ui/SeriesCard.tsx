import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { stripSeriesPrefix } from "../lib/stripSeriesPrefix";

const PREVIEW_COUNT = 3;

type SeriesCardPost = {
	slug: string;
	title: string;
	readingTimeMinutes: number;
};

type SeriesCardProps = {
	name: string;
	slug: string;
	description: string | null;
	posts: SeriesCardPost[];
};

export function SeriesCard({ name, slug, description, posts }: SeriesCardProps) {
	const preview = posts.slice(0, PREVIEW_COUNT);
	const moreLabel = posts.length > preview.length ? `전체 ${posts.length}편 보기` : "시리즈 페이지로";

	return (
		<section className="bg-card border-border-subtle row-span-3 grid grid-rows-subgrid overflow-hidden rounded-lg border">
			<div className="px-5.5 pt-5.5 pb-4">
				<span className="bg-accent-subtle text-accent text-11 mb-3.5 inline-flex h-6 items-center justify-center rounded-sm px-2.25 font-mono font-semibold tabular-nums">
					{posts.length}편
				</span>
				<h2 className="text-card-foreground mb-2.5 line-clamp-2 text-xl leading-tight font-bold tracking-tight">
					<Link href={`/series/${slug}`} className="hover:text-accent py-0.5 transition-colors">
						{name}
					</Link>
				</h2>
				{description && <p className="text-muted-foreground leading-body text-13 line-clamp-3">{description}</p>}
			</div>

			<ol className="border-border-subtle border-t px-5.5">
				{preview.map((post, index) => (
					<li key={post.slug} className="border-border-subtle not-last:border-b">
						<Link
							href={`/posts/${post.slug}`}
							className="group focus-visible:ring-ring grid-series-preview grid min-h-11 items-baseline gap-3 py-2.75 transition-colors focus-visible:ring-2 focus-visible:outline-none"
						>
							<span
								className="text-muted-foreground text-11 text-right font-mono tabular-nums"
								aria-hidden
							>{`${index + 1}`}</span>
							<span className="text-muted-foreground group-hover:text-accent truncate text-sm leading-relaxed transition-colors">
								{stripSeriesPrefix(post.title, name)}
							</span>
							<span className="text-muted-foreground text-chip whitespace-nowrap tabular-nums">
								{post.readingTimeMinutes}분
							</span>
						</Link>
					</li>
				))}
			</ol>

			<Link
				href={`/series/${slug}`}
				className="bg-bg-subtle text-muted-foreground hover:bg-accent-subtle hover:text-accent focus-visible:ring-ring flex h-12 items-center justify-between gap-2.5 self-end px-5.5 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
			>
				<span>{moreLabel}</span>
				<ArrowRight className="size-3.5" aria-hidden />
			</Link>
		</section>
	);
}
