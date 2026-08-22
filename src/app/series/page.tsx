import type { Metadata } from "next";

import { getPublicPosts } from "@/features/posts";
import { getAllSeries, getAllSeriesMeta, SeriesCard } from "@/features/series";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Container } from "@/shared/components/layouts/Container";
import { buildMetadata } from "@/shared/seo";

export const metadata: Metadata = buildMetadata({
	title: "시리즈",
	description:
		"연재 중인 시리즈별로 포스트를 모아 보세요. 연관된 여러 포스트를 순서대로 읽으며 React 19, Next.js App Router, WebRTC 등 기술 주제를 체계적으로 학습할 수 있는 시리즈 모음 허브입니다.",
	path: "/series"
});

export default function SeriesHubPage() {
	const series = getAllSeries(getPublicPosts(), getAllSeriesMeta());

	return (
		<Container>
			<div className="space-y-8 py-8 lg:py-10">
				<header className="space-y-3">
					<h1 className="text-foreground tracking-heading text-2xl leading-tight font-bold">시리즈</h1>
					<p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
						연재 중인 시리즈별로 포스트를 모아보세요
					</p>
				</header>

				{series.length === 0 ? (
					<EmptyState title="아직 시리즈가 없습니다." description="연재를 시작하면 여기에 모아 보여드립니다." />
				) : (
					<ul className="grid-series grid gap-6" aria-label="시리즈 목록">
						{series.map((item) => (
							<li key={item.slug} className="flex">
								<SeriesCard name={item.name} slug={item.slug} description={item.description} posts={item.posts} />
							</li>
						))}
					</ul>
				)}
			</div>
		</Container>
	);
}
