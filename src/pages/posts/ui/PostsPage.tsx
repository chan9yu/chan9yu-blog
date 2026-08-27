import type { Metadata } from "next";

import { getPublicPosts, resolvePostThumbnails } from "@/entities/post/index.server";
import { getTagCounts } from "@/entities/tag";
import { buildMetadata } from "@/shared/seo";
import { Container } from "@/shared/ui/Container";

import { TagFilteredPosts } from "./TagFilteredPosts";

export const metadata: Metadata = buildMetadata({
	title: "포스트",
	description:
		"chan9yu 개발 블로그의 전체 포스트 목록입니다. React와 TypeScript, Next.js, WebRTC 등 프론트엔드 실무 경험과 학습 기록을 모았고, 태그와 시리즈로 원하는 글을 찾아 읽을 수 있습니다.",
	path: "/posts"
});

export function PostsPage() {
	const basePosts = getPublicPosts();
	const allTags = getTagCounts(basePosts);
	const resolvedPosts = resolvePostThumbnails(basePosts);

	return (
		<Container>
			<div className="short:pt-6 w420:pt-16 pt-10">
				<header className="mb-8">
					<h1 className="text-foreground tracking-heading border-border-subtle mb-2.5 inline-block border-b-2 pb-2 text-2xl leading-tight font-bold">
						포스트
					</h1>
					<p className="text-muted-foreground text-subtitle leading-prose">개발하면서 배운 것들을 기록합니다</p>
				</header>

				<TagFilteredPosts posts={resolvedPosts} tags={allTags} />
			</div>
		</Container>
	);
}
