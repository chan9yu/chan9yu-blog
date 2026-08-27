import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { findAdjacentPosts, findRelatedPostsByTags, PostMetaHeader } from "@/entities/post";
import { getAllPosts, getPostDetail, getPublicPosts, resolveThumbnailSrc } from "@/entities/post/index.server";
import { getSeriesDetail } from "@/entities/series";
import { CommentsSection } from "@/features/comments";
import { ViewCounter } from "@/features/views";
import { getSiteUrl, siteMetadata } from "@/shared/config/site";
import { normalizeSlug } from "@/shared/lib/slug/slug";
import {
	buildBlogPostingJsonLd,
	buildBreadcrumbJsonLd,
	buildMetadata,
	JsonLdScript,
	NOT_FOUND_METADATA
} from "@/shared/seo";
import { Container } from "@/shared/ui/Container";
import { CustomMDX } from "@/widgets/mdx-content";
import { PostTocAside } from "@/widgets/toc";

import { PostNavigation } from "./PostNavigation";
import { ReadingProgress } from "./ReadingProgress";
import { RelatedPosts } from "./RelatedPosts";
import { SeriesNavigation } from "./SeriesNavigation";
import { ShareButtons } from "./ShareButtons";

type PostDetailPageProps = {
	params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
	return getAllPosts({ includePrivate: true }).map((post) => ({ slug: post.slug }));
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

export async function PostDetailPage({ params }: PostDetailPageProps) {
	const { slug } = await params;

	const normalized = normalizeSlug(slug);
	if (!normalized) notFound();

	const detail = getPostDetail(normalized);
	if (!detail) notFound();

	const allPosts = getPublicPosts();
	const adjacent = findAdjacentPosts(allPosts, detail.slug);
	const related = findRelatedPostsByTags(allPosts, detail);
	const currentSeries = detail.series ? getSeriesDetail(allPosts, detail.series) : null;
	const siteUrl = getSiteUrl();
	const shareUrl = `${siteUrl}/posts/${detail.slug}`;
	const thumbnailSrc = resolveThumbnailSrc(detail.thumbnail, detail.slug);

	const blogPostingLd = detail.private
		? null
		: buildBlogPostingJsonLd({
				siteUrl,
				authorName: siteMetadata.author,
				slug: detail.slug,
				title: detail.title,
				description: detail.description,
				date: detail.date,
				modified: detail.updated,
				tags: detail.tags,
				image: detail.thumbnail ?? null
			});

	const breadcrumbLd = detail.private
		? null
		: buildBreadcrumbJsonLd({
				siteUrl,
				items: [
					{ name: siteMetadata.name, path: "/" },
					{ name: "포스트", path: "/posts" },
					{ name: detail.title, path: `/posts/${detail.slug}` }
				]
			});

	return (
		<>
			{blogPostingLd && <JsonLdScript id="blogposting-json-ld" data={blogPostingLd} />}
			{breadcrumbLd && <JsonLdScript id="breadcrumb-json-ld" data={breadcrumbLd} />}
			<ReadingProgress />
			<Container>
				<div className="short:pt-6 w420:pt-16 lg:grid-content-aside grid pt-10">
					<article className="min-w-0 space-y-10 pb-12 sm:pb-16">
						<PostMetaHeader
							post={detail}
							shareSlot={<ShareButtons title={detail.title} url={shareUrl} />}
							viewCounterSlot={
								<Suspense
									fallback={<span className="bg-muted inline-block h-4 w-12 animate-pulse rounded" aria-hidden />}
								>
									<ViewCounter slug={detail.slug} />
								</Suspense>
							}
						/>

						{currentSeries && <SeriesNavigation series={currentSeries} currentSlug={detail.slug} />}

						{thumbnailSrc && (
							<div className="relative aspect-2/1 w-full overflow-hidden rounded-lg">
								<Image
									src={thumbnailSrc}
									alt={detail.title}
									fill
									priority
									className="object-cover"
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 800px"
								/>
							</div>
						)}

						<section aria-label="본문" className="prose">
							<CustomMDX source={detail.contentMdx} />
						</section>

						<PostNavigation adjacent={adjacent} />

						<RelatedPosts posts={related} />

						<CommentsSection slug={detail.slug} isPrivate={detail.private} />
					</article>

					<PostTocAside items={detail.toc} />
				</div>
			</Container>
		</>
	);
}
