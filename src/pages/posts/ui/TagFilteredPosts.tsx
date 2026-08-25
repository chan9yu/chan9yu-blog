"use client";

import { useSearchParams } from "next/navigation";

import type { PostSummary } from "@/entities/post";
import type { TagCount } from "@/entities/tag";
import { getPostsByTag } from "@/entities/tag";
import { formatLocalizedSlug } from "@/shared/lib/format/formatLocalizedSlug";
import { PostList } from "@/widgets/post-list";

import { TagFilter } from "./TagFilter";

type TagFilteredPostsProps = {
	posts: PostSummary[];
	tags: TagCount[];
};

export function TagFilteredPosts({ posts, tags }: TagFilteredPostsProps) {
	const searchParams = useSearchParams();
	const activeTag = searchParams?.get("tag") ?? null;

	const visiblePosts = activeTag ? getPostsByTag(posts, activeTag) : posts;
	const scope = activeTag ? `#${formatLocalizedSlug(activeTag)}` : "전체";
	const countLabel = `${scope}, ${visiblePosts.length}개의 포스트`;

	return (
		<div className="lg:grid-tag-rail grid gap-7 lg:gap-11">
			<TagFilter tags={tags} activeTag={activeTag} />

			<div className="min-w-0">
				<p role="status" aria-live="polite" className="sr-only">
					{countLabel}
				</p>

				<PostList key={activeTag ?? ""} posts={visiblePosts} countLabel={countLabel} />
			</div>
		</div>
	);
}
