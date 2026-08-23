import type { Metadata } from "next";

import { getPublicPosts, resolvePostThumbnails } from "@/entities/post/index.server";
import { getTagCounts } from "@/entities/tag";
import { buildMetadata } from "@/shared/seo";
import { Container } from "@/shared/ui/Container";
import { PostList } from "@/widgets/post-list";

import { TagFilter } from "./TagFilter";

export const metadata: Metadata = buildMetadata({
	title: "포스트",
	description:
		"chan9yu 개발 블로그의 전체 포스트 목록. React, TypeScript, Next.js, WebRTC 등 프론트엔드 실무 경험과 학습 기록을 모은 기술 글 모음으로, 태그·시리즈별로 탐색할 수 있습니다.",
	path: "/posts"
});

export function PostsPage() {
	const basePosts = getPublicPosts();
	const allTags = getTagCounts(basePosts);
	const resolvedPosts = resolvePostThumbnails(basePosts);

	return (
		<Container>
			<div className="space-y-8 py-8 lg:py-10">
				<header className="space-y-3">
					<h1 className="text-foreground tracking-heading text-2xl leading-tight font-bold">포스트</h1>
					<p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
						개발하면서 배운 것들을 기록합니다
					</p>
				</header>

				<div className="flex flex-col lg:flex-row lg:gap-8">
					<TagFilter tags={allTags} />

					<div className="min-w-0 flex-1">
						<PostList posts={resolvedPosts} />
					</div>
				</div>
			</div>
		</Container>
	);
}
