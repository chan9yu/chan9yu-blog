import type { Metadata } from "next";

import { getPublicPosts } from "@/entities/post/index.server";
import { getTagCounts } from "@/entities/tag";
import { TagCard } from "@/entities/tag";
import { buildMetadata } from "@/shared/seo";
import { Container } from "@/shared/ui/Container";
import { EmptyState } from "@/shared/ui/EmptyState";

export const metadata: Metadata = buildMetadata({
	title: "태그",
	description:
		"주제별 태그로 정리된 포스트를 탐색하세요. React, TypeScript, Next.js, WebRTC 등 다양한 기술 주제를 한눈에 확인할 수 있고, 관심 있는 주제별로 포스트를 빠르게 찾을 수 있는 허브 페이지입니다.",
	path: "/tags"
});

export function TagsHubPage() {
	const tags = getTagCounts(getPublicPosts());

	return (
		<Container>
			<div className="space-y-8 py-8 lg:py-10">
				<header className="space-y-3">
					<h1 className="text-foreground tracking-heading text-2xl leading-tight font-bold">태그</h1>
					<p className="text-muted-foreground text-sm leading-relaxed sm:text-base">모든 태그를 한눈에 확인하세요</p>
				</header>

				{tags.length === 0 ? (
					<EmptyState title="아직 태그가 없습니다." description="글이 쌓이면 주제별로 모아 보여드립니다." />
				) : (
					<ul className="grid-tags grid gap-3" aria-label="태그 목록">
						{tags.map((item) => (
							<li key={item.slug}>
								<TagCard tag={item.tag} slug={item.slug} count={item.count} />
							</li>
						))}
					</ul>
				)}
			</div>
		</Container>
	);
}
