import type { PostSummary } from "@/shared/types";

const RSS_ITEM_LIMIT = 50;

type BuildRssFeedInput = {
	siteUrl: string;
	siteTitle: string;
	siteDescription: string;
	authorName: string;
	authorEmail: string;
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

function buildItemXml(siteUrl: string, authorName: string, authorEmail: string, post: PostSummary) {
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
		`      <author>${escapeXml(authorEmail)} (${escapeXml(authorName)})</author>`,
		categories,
		"    </item>"
	].filter((line) => line.length > 0);

	return lines.join("\n");
}

export function buildRssFeed(input: BuildRssFeedInput) {
	const { siteUrl, siteTitle, siteDescription, authorName, authorEmail, locale, posts } = input;
	const language = locale.replace("_", "-");

	const limited = posts.slice(0, RSS_ITEM_LIMIT);
	const items = limited.map((post) => buildItemXml(siteUrl, authorName, authorEmail, post)).join("\n");

	const firstPost = limited[0];
	const lastBuildDate = firstPost ? new Date(firstPost.date).toUTCString() : new Date().toUTCString();

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
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
