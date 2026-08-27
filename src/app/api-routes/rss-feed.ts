import type { PostSummary } from "@/entities/post";
import { getPublicPosts } from "@/entities/post/index.server";
import { getSiteUrl, siteMetadata } from "@/shared/config/site";

const RSS_ITEM_LIMIT = 50;

type BuildRssFeedInput = {
	siteUrl: string;
	siteTitle: string;
	siteDescription: string;
	authorName: string;
	locale: string;
	posts: PostSummary[];
};

function escapeXml(value: string) {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

function resolveLastBuildDate(posts: PostSummary[]) {
	let latest: Date | undefined;

	for (const post of posts) {
		const modified = new Date(post.updated ?? post.date);
		if (!latest || modified > latest) {
			latest = modified;
		}
	}

	return (latest ?? new Date()).toUTCString();
}

function buildItemXml(siteUrl: string, authorName: string, post: PostSummary) {
	const url = `${siteUrl}/posts/${post.slug}`;
	const pubDate = new Date(post.date).toUTCString();
	const categories = post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join("\n");

	const lines = [
		"    <item>",
		`      <title>${escapeXml(post.title)}</title>`,
		`      <link>${escapeXml(url)}</link>`,
		`      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
		`      <description>${escapeXml(post.description)}</description>`,
		`      <pubDate>${pubDate}</pubDate>`,
		`      <dc:creator>${escapeXml(authorName)}</dc:creator>`,
		categories,
		"    </item>"
	].filter((line) => line.length > 0);

	return lines.join("\n");
}

export function buildRssFeed(input: BuildRssFeedInput) {
	const { siteUrl, siteTitle, siteDescription, authorName, locale, posts } = input;
	const language = locale.replace("_", "-");

	const limited = posts.slice(0, RSS_ITEM_LIMIT);
	const items = limited.map((post) => buildItemXml(siteUrl, authorName, post)).join("\n");
	const lastBuildDate = resolveLastBuildDate(limited);

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
		"  <channel>",
		`    <title>${escapeXml(siteTitle)}</title>`,
		`    <link>${escapeXml(siteUrl)}</link>`,
		`    <description>${escapeXml(siteDescription)}</description>`,
		`    <language>${language}</language>`,
		`    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
		`    <atom:link href="${escapeXml(siteUrl)}/rss" rel="self" type="application/rss+xml" />`,
		items,
		"  </channel>",
		"</rss>"
	]
		.filter((line) => line.length > 0)
		.join("\n");
}

export function getRssFeed() {
	const xml = buildRssFeed({
		siteUrl: getSiteUrl(),
		siteTitle: siteMetadata.title,
		siteDescription: siteMetadata.description,
		authorName: siteMetadata.author,
		locale: siteMetadata.locale,
		posts: getPublicPosts()
	});

	return new Response(xml, {
		headers: {
			"Content-Type": "application/xml; charset=UTF-8",
			"Cache-Control": "s-maxage=3600, stale-while-revalidate"
		}
	});
}
