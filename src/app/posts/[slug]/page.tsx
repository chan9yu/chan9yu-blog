import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CommentsSection } from "@/features/comments";
import {
	findAdjacentPosts,
	findRelatedPostsByTags,
	getPostDetail,
	getPublicPosts,
	PostMetaHeader,
	PostNavigation,
	PostTocAside,
	ReadingProgress,
	RelatedPosts,
	ShareButtons
} from "@/features/posts";
import { getSeriesDetail, SeriesNavigation } from "@/features/series";
import { ViewCounter } from "@/features/views";
import { Container } from "@/shared/components/layouts/Container";
import { CustomMDX } from "@/shared/components/mdx/CustomMDX";
import { getSiteUrl, siteMetadata } from "@/shared/config/site";
import {
	buildBlogPostingJsonLd,
	buildBreadcrumbJsonLd,
	buildMetadata,
	JsonLdScript,
	NOT_FOUND_METADATA
} from "@/shared/seo";
import { resolveThumbnailSrc } from "@/shared/utils/resolveThumbnail";
import { normalizeSlug } from "@/shared/utils/slug";

type PostDetailPageProps = {
	params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
	return getPublicPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostDetailPageProps) {
	const { slug } = await params;

	const normalized = normalizeSlug(slug);
	if (!normalized) return NOT_FOUND_METADATA;

	const post = getPostDetail(normalized);
	if (!post) return NOT_FOUND_METADATA;

	return buildMetadata({
		title: post.title,
		description: post.description,
		path: `/posts/${post.slug}`,
		image: post.thumbnail ?? undefined,
		type: "article",
		publishedAt: post.date,
		modifiedAt: post.updated,
		authors: [siteMetadata.author],
		tags: post.tags,
		noIndex: post.private
	});
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
	const { slug } = await params;

	const normalized = normalizeSlug(slug);
	if (!normalized) notFound();

	const detail = getPostDetail(normalized);
	if (!detail) notFound();
	const summary = detail;

	const allPosts = getPublicPosts();
	const adjacent = findAdjacentPosts(allPosts, summary.slug);
	const related = findRelatedPostsByTags(allPosts, summary);
	const currentSeries = summary.series ? getSeriesDetail(allPosts, summary.series) : null;
	const siteUrl = getSiteUrl();
	const shareUrl = `${siteUrl}/posts/${summary.slug}`;
	const thumbnailSrc = resolveThumbnailSrc(summary.thumbnail, summary.slug);

	const blogPostingLd = summary.private
		? null
		: buildBlogPostingJsonLd({
				siteUrl,
				authorName: siteMetadata.author,
				slug: summary.slug,
				title: summary.title,
				description: summary.description,
				date: summary.date,
				modified: summary.updated,
				tags: summary.tags,
				image: summary.thumbnail ?? null
			});

	const breadcrumbLd = summary.private
		? null
		: buildBreadcrumbJsonLd({
				siteUrl,
				items: [
					{ name: "홈", path: "/" },
					{ name: "포스트", path: "/posts" },
					{ name: summary.title, path: `/posts/${summary.slug}` }
				]
			});

	return (
		<>
			{blogPostingLd && <JsonLdScript id="blogposting-json-ld" data={blogPostingLd} />}
			{breadcrumbLd && <JsonLdScript id="breadcrumb-json-ld" data={breadcrumbLd} />}
			<ReadingProgress />
			<Container>
				<div className="flex flex-col py-8 lg:flex-row lg:py-10">
					<article className="min-w-0 flex-1 space-y-10 pb-12 sm:pb-16">
						<PostMetaHeader
							post={summary}
							shareSlot={<ShareButtons title={summary.title} url={shareUrl} />}
							viewCounterSlot={
								<Suspense
									fallback={<span className="bg-muted inline-block h-4 w-12 animate-pulse rounded" aria-hidden />}
								>
									<ViewCounter slug={summary.slug} />
								</Suspense>
							}
						/>

						{currentSeries && <SeriesNavigation series={currentSeries} currentSlug={summary.slug} />}

						{thumbnailSrc && (
							<div className="relative aspect-2/1 w-full overflow-hidden rounded-lg">
								<Image
									src={thumbnailSrc}
									alt={summary.title}
									fill
									priority
									className="object-cover"
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 800px"
								/>
							</div>
						)}

						<section aria-label="본문" className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
							<CustomMDX source={detail.contentMdx} />
						</section>

						<PostNavigation adjacent={adjacent} />

						<RelatedPosts posts={related} />

						<CommentsSection slug={summary.slug} isPrivate={summary.private} />
					</article>

					<PostTocAside items={detail.toc} />
				</div>
			</Container>
		</>
	);
}
