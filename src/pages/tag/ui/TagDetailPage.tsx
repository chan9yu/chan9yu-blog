import { notFound } from "next/navigation";
import { cache } from "react";

import { getPublicPosts, resolvePostThumbnails } from "@/entities/post/index.server";
import { getAllTags, getPostsByTag, TAG_INDEX_MIN_POSTS } from "@/entities/tag";
import { getSiteUrl, siteMetadata } from "@/shared/config/site";
import { formatLocalizedSlug } from "@/shared/lib/format/formatLocalizedSlug";
import { buildBreadcrumbJsonLd, buildMetadata, JsonLdScript, NOT_FOUND_METADATA } from "@/shared/seo";
import { Breadcrumb } from "@/shared/ui/Breadcrumb";
import { Container } from "@/shared/ui/Container";
import { PostList } from "@/widgets/post-list";

type TagDetailPageProps = {
	params: Promise<{ tag: string }>;
};

const findPostsByTag = cache((decoded: string) => getPostsByTag(getPublicPosts(), decoded));

const DESCRIPTION_MAX_LENGTH = 160;

function buildTagDescription(display: string, titles: string[], total: number) {
	const head = `${display} 태그 글 ${total}편.`;
	let description = head;

	for (const title of titles) {
		const next = description === head ? `${head} ${title}` : `${description}, ${title}`;
		if (next.length > DESCRIPTION_MAX_LENGTH) {
			break;
		}
		description = next;
	}

	return description;
}

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
	const isThin = matched.length < TAG_INDEX_MIN_POSTS;

	return buildMetadata({
		title: `#${display}`,
		description: buildTagDescription(
			display,
			matched.map((post) => post.title),
			matched.length
		),
		path: `/tags/${encodeURIComponent(decoded)}`,
		noIndex: isThin,
		follow: isThin
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
			{ name: siteMetadata.name, path: "/" },
			{ name: "태그", path: "/tags" },
			{ name: `#${display}`, path: `/tags/${encodeURIComponent(decoded)}` }
		]
	});

	return (
		<>
			<JsonLdScript id="tag-breadcrumb-json-ld" data={breadcrumbLd} />
			<Container>
				<div className="short:pt-6 w420:pt-16 pt-10 pb-8 lg:pb-10">
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
