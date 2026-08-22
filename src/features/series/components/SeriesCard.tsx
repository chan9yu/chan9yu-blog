import { ArrowRight } from "lucide-react";
import Link from "next/link";

import type { PostSummary } from "@/shared/types";

import { stripSeriesPrefix } from "../utils/stripSeriesPrefix";

const PREVIEW_COUNT = 3;

type SeriesCardProps = {
	name: string;
	slug: string;
	description: string | null;
	posts: PostSummary[];
};

export function SeriesCard({ name, slug, description, posts }: SeriesCardProps) {
	const preview = posts.slice(0, PREVIEW_COUNT);
	const moreLabel = posts.length > preview.length ? `전체 ${posts.length}편 보기` : "시리즈 페이지로";

	return (
		<section className="bg-card border-border-subtle flex h-full flex-col overflow-hidden rounded-lg border">
			<div className="h-series-head flex flex-col gap-3 p-6">
				<span className="bg-bg-muted text-muted-foreground w-fit rounded-full px-2.5 py-1 text-xs font-medium tabular-nums">
					{posts.length}편
				</span>
				<h2 className="text-card-foreground line-clamp-2 text-lg leading-snug font-bold tracking-tight">
					<Link href={`/series/${slug}`} className="hover:text-accent transition-colors">
						{name}
					</Link>
				</h2>
				{description && <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">{description}</p>}
			</div>

			<ol className="px-6">
				{preview.map((post, index) => (
					<li key={post.slug} className="border-border-subtle not-last:border-b">
						<Link
							href={`/posts/${post.slug}`}
							className="group focus-visible:ring-ring flex min-h-11 items-center gap-3 py-2.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
						>
							<span
								className="text-muted-foreground w-4 shrink-0 text-xs tabular-nums"
								aria-hidden
							>{`${index + 1}`}</span>
							<span className="text-muted-foreground group-hover:text-accent line-clamp-1 flex-1 text-sm transition-colors">
								{stripSeriesPrefix(post.title, name)}
							</span>
							<span className="text-muted-foreground shrink-0 text-xs tabular-nums">{post.readingTimeMinutes}분</span>
						</Link>
					</li>
				))}
			</ol>

			<Link
				href={`/series/${slug}`}
				className="bg-bg-subtle text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring mt-auto flex h-12 items-center justify-center gap-1.5 text-sm font-medium transition-[background-color,color] focus-visible:ring-2 focus-visible:outline-none"
			>
				<span>{moreLabel}</span>
				<ArrowRight className="size-3.5" aria-hidden />
			</Link>
		</section>
	);
}
