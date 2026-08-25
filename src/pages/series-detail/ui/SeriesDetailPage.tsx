import { BookOpen, Calendar } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { Thumbnail } from "@/entities/post";
import { getPublicPosts } from "@/entities/post/index.server";
import { getAllSeries, getSeriesDetail, stripSeriesPrefix } from "@/entities/series";
import { getAllSeriesMeta } from "@/entities/series/index.server";
import { getSiteUrl } from "@/shared/config/site";
import { formatDate } from "@/shared/lib/format/formatDate";
import { buildBreadcrumbJsonLd, buildMetadata, JsonLdScript, NOT_FOUND_METADATA } from "@/shared/seo";
import { Breadcrumb } from "@/shared/ui/Breadcrumb";
import { Container } from "@/shared/ui/Container";

type SeriesDetailPageProps = {
	params: Promise<{ slug: string }>;
};

const findSeriesBySlug = cache((slug: string) => getSeriesDetail(getPublicPosts(), slug, getAllSeriesMeta()));

const EAGER_THUMBNAIL_COUNT = 3;

export async function generateStaticParams() {
	return getAllSeries(getPublicPosts(), getAllSeriesMeta()).map((series) => ({ slug: series.slug }));
}

export async function generateMetadata({ params }: SeriesDetailPageProps) {
	const { slug } = await params;
	const series = findSeriesBySlug(decodeURIComponent(slug));
	if (!series) return NOT_FOUND_METADATA;

	return buildMetadata({
		title: series.name,
		description:
			series.description ?? `${series.name} 시리즈. 총 ${series.posts.length}개의 연재 글로 구성되어 있습니다.`,
		path: `/series/${encodeURIComponent(series.slug)}`
	});
}

export async function SeriesDetailPage({ params }: SeriesDetailPageProps) {
	const { slug } = await params;
	const series = findSeriesBySlug(decodeURIComponent(slug));
	if (!series) notFound();

	const breadcrumbLd = buildBreadcrumbJsonLd({
		siteUrl: getSiteUrl(),
		items: [
			{ name: "홈", path: "/" },
			{ name: "시리즈", path: "/series" },
			{ name: series.name, path: `/series/${encodeURIComponent(series.slug)}` }
		]
	});

	return (
		<>
			<JsonLdScript id="series-breadcrumb-json-ld" data={breadcrumbLd} />
			<Container>
				<div className="short:pt-6 w420:pt-16 pt-10 pb-8 lg:pb-10">
					<header className="mb-12 space-y-6">
						<Breadcrumb items={[{ label: "시리즈", href: "/series" }, { label: series.name }]} />
						<div className="space-y-4">
							<h1 className="text-foreground tracking-heading text-2xl leading-tight font-bold text-balance break-keep">
								{series.name}
							</h1>
							{series.description && (
								<p className="text-muted-foreground leading-relaxed break-keep">{series.description}</p>
							)}
							<div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
								<span className="inline-flex items-center gap-2">
									<BookOpen className="size-4" aria-hidden />총 {series.posts.length}개의 글
								</span>
							</div>
						</div>
						<hr className="border-border" />
					</header>

					<ol className="space-y-4" aria-label="시리즈 포스트">
						{series.posts.map((post, index) => (
							<li key={post.slug} className="flex gap-4">
								<span
									className="bg-muted text-muted-foreground mt-3 flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold tabular-nums"
									aria-hidden
								>
									{post.seriesOrder ?? "—"}
								</span>
								<Link
									href={`/posts/${post.slug}`}
									className="group bg-card border-border-subtle focus-visible:ring-ring hover:border-accent/40 grid-post-row grid flex-1 items-stretch gap-4 rounded-lg border p-5 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none lg:gap-5"
								>
									<Thumbnail
										src={post.thumbnail}
										sizes="(max-width: 1023px) 100vw, 260px"
										priority={index < EAGER_THUMBNAIL_COUNT}
										rounded
										className="lg:aspect-auto lg:h-full"
									/>

									<div className="min-w-0">
										<h2 className="text-card-foreground group-hover:text-accent line-clamp-2 text-base leading-snug font-semibold transition-colors sm:text-lg">
											{stripSeriesPrefix(post.title, series.name)}
										</h2>
										<p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-relaxed">
											{post.description}
										</p>
										<time
											className="text-muted-foreground mt-2 inline-flex items-center gap-1.5 text-xs tabular-nums"
											dateTime={post.date}
										>
											<Calendar className="size-3.5" aria-hidden />
											{formatDate(post.date)}
										</time>
									</div>
								</Link>
							</li>
						))}
					</ol>
				</div>
			</Container>
		</>
	);
}
