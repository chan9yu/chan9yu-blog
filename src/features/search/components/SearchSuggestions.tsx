"use client";

import { Hash, TrendingUp } from "lucide-react";
import Link from "next/link";

import type { PostSummary } from "@/shared/types";
import { formatDate } from "@/shared/utils/formatDate";
import { formatLocalizedSlug } from "@/shared/utils/formatLocalizedSlug";

const RECENT_POSTS_LIMIT = 3;
const TRENDING_TAGS_LIMIT = 5;

function computeTrendingTags(posts: ReadonlyArray<PostSummary>, limit: number): string[] {
	const counts = new Map<string, number>();
	for (const post of posts) {
		for (const tag of post.tags) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}
	}

	return Array.from(counts.entries())
		.sort(([aTag, aCount], [bTag, bCount]) => bCount - aCount || aTag.localeCompare(bTag))
		.slice(0, limit)
		.map(([tag]) => tag);
}

type SearchSuggestionsProps = {
	posts: ReadonlyArray<PostSummary>;
	onSelect: () => void;
};

export function SearchSuggestions({ posts, onSelect }: SearchSuggestionsProps) {
	const trendingTags = computeTrendingTags(posts, TRENDING_TAGS_LIMIT);
	const recentPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, RECENT_POSTS_LIMIT);

	if (trendingTags.length === 0 && recentPosts.length === 0) {
		return (
			<div className="text-muted-foreground flex items-center justify-center py-12 text-center text-sm">
				검색어를 입력하세요
			</div>
		);
	}

	return (
		<div className="space-y-4 px-2 py-3" aria-label="검색 추천">
			{trendingTags.length > 0 && (
				<section aria-labelledby="search-trending-tags-heading">
					<h2
						id="search-trending-tags-heading"
						className="text-muted-foreground mb-2 flex items-center gap-1.5 px-1 text-xs font-medium tracking-wide uppercase"
					>
						<TrendingUp className="size-3.5" aria-hidden />
						인기 태그
					</h2>
					<ul className="flex flex-wrap gap-2 px-1">
						{trendingTags.map((tag) => (
							<li key={tag}>
								<Link
									href={`/tags/${encodeURIComponent(tag)}`}
									onClick={onSelect}
									className="border-border-subtle text-muted-foreground hover:border-accent/50 hover:bg-accent-subtle hover:text-accent focus-visible:ring-ring inline-flex items-center gap-1 rounded border px-2.5 py-1 font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
								>
									<Hash className="size-3" aria-hidden />
									{formatLocalizedSlug(tag)}
								</Link>
							</li>
						))}
					</ul>
				</section>
			)}

			{recentPosts.length > 0 && (
				<section aria-labelledby="search-recent-posts-heading">
					<h2
						id="search-recent-posts-heading"
						className="text-muted-foreground mb-2 px-1 text-xs font-medium tracking-wide uppercase"
					>
						최근 포스트
					</h2>
					<ul className="space-y-1">
						{recentPosts.map((post) => (
							<li key={post.slug}>
								<Link
									href={`/posts/${post.slug}`}
									onClick={onSelect}
									className="hover:bg-muted focus-visible:bg-muted focus-visible:ring-ring block rounded-md px-3 py-2 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
								>
									<p className="text-foreground line-clamp-1 text-sm font-medium">{post.title}</p>
									<p className="text-muted-foreground line-clamp-1 text-xs tabular-nums">{formatDate(post.date)}</p>
								</Link>
							</li>
						))}
					</ul>
				</section>
			)}
		</div>
	);
}
