import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { getPublicPosts, getTrendingPosts, resolvePostThumbnails } from "@/entities/post/index.server";
import { getTrendingSeries } from "@/entities/series";
import { getTrendingTags } from "@/entities/tag";
import { buildMetadata } from "@/shared/seo";
import { Container } from "@/shared/ui/Container";
import { RecentPostsList } from "@/widgets/post-list";

import { HomeHero } from "./HomeHero";
import { HomeSidebar } from "./HomeSidebar";
import { PopularPosts } from "./PopularPosts";
import { SidebarSection } from "./SidebarSection";
import { TrendingSeries } from "./TrendingSeries";
import { TrendingTags } from "./TrendingTags";

export const metadata: Metadata = buildMetadata({
	title: "chan9yu | 프론트엔드 개발 블로그",
	description:
		"프론트엔드 엔지니어 chan9yu의 기술 블로그. React 19, TypeScript, Next.js App Router 실무 경험과 WebRTC, 웹 성능 최적화 등 다양한 주제를 깊이 있게 다루며 최신 학습 내용을 정리해 공유합니다.",
	path: "/"
});

const RECENT_POSTS_LIMIT = 6;
const POPULAR_POSTS_LIMIT = 5;
const TRENDING_SERIES_LIMIT = 3;
const TRENDING_TAGS_LIMIT = 10;

export async function HomePage() {
	const allPosts = getPublicPosts();
	const recentPosts = resolvePostThumbnails(allPosts.slice(0, RECENT_POSTS_LIMIT));

	const trending = await getTrendingPosts(allPosts, POPULAR_POSTS_LIMIT);
	const popularPosts = resolvePostThumbnails(trending.posts);

	const trendingSeries = getTrendingSeries(allPosts, TRENDING_SERIES_LIMIT);
	const trendingTags = getTrendingTags(allPosts, TRENDING_TAGS_LIMIT);

	return (
		<Container>
			<div className="short:pt-6 w420:pt-16 lg:grid-home grid gap-12 pt-10 lg:gap-14">
				<div className="min-w-0 space-y-14">
					<HomeHero />

					<section aria-labelledby="recent-posts-title">
						<RecentPostsList
							posts={recentPosts}
							title="최근 포스트"
							titleId="recent-posts-title"
							footer={
								<Link
									href="/posts"
									className="group bg-card border-border-subtle text-muted-foreground hover:border-accent/40 hover:text-accent focus-visible:ring-ring flex h-12 items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
								>
									전체 포스트 보기
									<ArrowRight
										className="size-4 transition-transform duration-200 motion-safe:group-hover:translate-x-1"
										aria-hidden
									/>
								</Link>
							}
						/>
					</section>
				</div>

				<HomeSidebar>
					<SidebarSection title="Popular Posts" titleId="popular-posts-title">
						<PopularPosts posts={popularPosts} />
					</SidebarSection>
					<SidebarSection title="Popular Series" titleId="trending-series-title">
						<TrendingSeries series={trendingSeries} />
					</SidebarSection>
					<SidebarSection title="Popular Tags" titleId="trending-tags-title">
						<TrendingTags tags={trendingTags} />
					</SidebarSection>
				</HomeSidebar>
			</div>
		</Container>
	);
}
