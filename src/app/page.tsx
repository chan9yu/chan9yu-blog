import type { Metadata } from "next";
import Link from "next/link";

import { HomeHero } from "@/features/about";
import { getPublicPosts, getTrendingPosts, PopularPosts, RecentPostsList } from "@/features/posts";
import { getTrendingSeries, TrendingSeries } from "@/features/series";
import { getTrendingTags, TrendingTags } from "@/features/tags";
import { SectionTitle } from "@/shared/components/common/SectionTitle";
import { SidebarSection } from "@/shared/components/common/SidebarSection";
import { Container } from "@/shared/components/layouts/Container";
import { buildMetadata } from "@/shared/seo";
import { resolvePostThumbnails } from "@/shared/utils/resolveThumbnail";

export const metadata: Metadata = buildMetadata({
	title: "chan9yu | 프론트엔드 개발 블로그",
	description:
		"프론트엔드 엔지니어 chan9yu의 기술 블로그. React 19, TypeScript, Next.js App Router 실무 경험과 WebRTC, 웹 성능 최적화 등 다양한 주제를 깊이 있게 다루며 최신 학습 내용을 정리해 공유합니다.",
	path: "/"
});

export const revalidate = 3600;

const RECENT_POSTS_LIMIT = 6;
const POPULAR_POSTS_LIMIT = 5;
const TRENDING_SERIES_LIMIT = 3;
const TRENDING_TAGS_LIMIT = 10;

export default async function HomePage() {
	const allPosts = getPublicPosts();
	const recentPosts = resolvePostThumbnails(allPosts.slice(0, RECENT_POSTS_LIMIT));

	const trending = await getTrendingPosts(allPosts, POPULAR_POSTS_LIMIT);
	const popularPosts = resolvePostThumbnails(trending.posts);

	const trendingSeries = getTrendingSeries(allPosts, TRENDING_SERIES_LIMIT);
	const trendingTags = getTrendingTags(allPosts, TRENDING_TAGS_LIMIT);

	return (
		<Container>
			<div className="flex flex-col gap-10 py-8 lg:flex-row lg:py-10">
				<div className="min-w-0 flex-1 space-y-10 sm:space-y-14">
					<HomeHero />

					<section aria-labelledby="recent-posts-title" className="space-y-4 sm:space-y-6">
						<SectionTitle
							id="recent-posts-title"
							action={
								<Link
									href="/posts"
									aria-label="최근 포스트 전체 보기"
									className="text-accent focus-visible:ring-ring shrink-0 rounded text-sm font-medium transition-colors hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
								>
									전체 보기 <span aria-hidden>&rarr;</span>
								</Link>
							}
						>
							최근 포스트
						</SectionTitle>
						<RecentPostsList posts={recentPosts} />
					</section>
				</div>

				<aside aria-label="추천 블록" className="hidden lg:block lg:w-64 lg:shrink-0">
					<div className="sticky top-24 space-y-6">
						<SidebarSection title="Popular Posts" titleId="popular-posts-title" lang="en">
							<PopularPosts posts={popularPosts} />
						</SidebarSection>

						<hr className="border-border-subtle" />

						<SidebarSection title="Popular Series" titleId="trending-series-title" lang="en">
							<TrendingSeries series={trendingSeries} />
						</SidebarSection>

						<hr className="border-border-subtle" />

						<SidebarSection title="Popular Tags" titleId="trending-tags-title" lang="en">
							<TrendingTags tags={trendingTags} />
						</SidebarSection>
					</div>
				</aside>
			</div>
		</Container>
	);
}
