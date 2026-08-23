import { notFound } from "next/navigation";
import { cache } from "react";

import { getPublicPosts, resolvePostThumbnails } from "@/entities/post/index.server";
import { getAllTags, getPostsByTag } from "@/entities/tag";
import { getSiteUrl } from "@/shared/config/site";
import { formatLocalizedSlug } from "@/shared/lib/format/formatLocalizedSlug";
import { buildBreadcrumbJsonLd, buildMetadata, JsonLdScript, NOT_FOUND_METADATA } from "@/shared/seo";
import { Breadcrumb } from "@/shared/ui/Breadcrumb";
import { Container } from "@/shared/ui/Container";
import { PostList } from "@/widgets/post-list";

type TagDetailPageProps = {
	params: Promise<{ tag: string }>;
};

const findPostsByTag = cache((decoded: string) => getPostsByTag(getPublicPosts(), decoded));

export async function generateStaticParams() {
	return getAllTags(getPublicPosts()).map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: TagDetailPageProps) {
	const { tag } = await params;
	const decoded = decodeURIComponent(tag);
	if (!decoded) return NOT_FOUND_METADATA;

	const matched = findPostsByTag(decoded);
	if (matched.length === 0) return NOT_FOUND_METADATA;

	const display = formatLocalizedSlug(decoded);
	return buildMetadata({
		title: `#${display}`,
		description: `${display} 태그가 포함된 포스트를 확인하세요. 관련 주제의 글을 한눈에 탐색할 수 있습니다.`,
		path: `/tags/${encodeURIComponent(decoded)}`
	});
}

export async function TagDetailPage({ params }: TagDetailPageProps) {
	const { tag } = await params;

	const decoded = decodeURIComponent(tag);
	if (!decoded) notFound();

	const filtered = resolvePostThumbnails(findPostsByTag(decoded));
	if (filtered.length === 0) {
		notFound();
	}

	const display = formatLocalizedSlug(decoded);
	const breadcrumbLd = buildBreadcrumbJsonLd({
		siteUrl: getSiteUrl(),
		items: [
			{ name: "홈", path: "/" },
			{ name: "태그", path: "/tags" },
			{ name: `#${display}`, path: `/tags/${encodeURIComponent(decoded)}` }
		]
	});

	return (
		<>
			<JsonLdScript id="tag-breadcrumb-json-ld" data={breadcrumbLd} />
			<Container>
				<div className="py-8 lg:py-10">
					<header className="mb-12 space-y-6">
						<Breadcrumb items={[{ label: "태그", href: "/tags" }, { label: `#${display}` }]} />
						<div className="space-y-4">
							<h1 className="text-foreground tracking-heading text-2xl leading-tight font-bold text-balance break-keep">
								#{display}
							</h1>
							<p className="text-muted-foreground text-sm">총 {filtered.length}개의 글</p>
						</div>
						<hr className="border-border" />
					</header>

					<PostList posts={filtered} />
				</div>
			</Container>
		</>
	);
}
