import type { MetadataRoute } from "next";

import type { PostSummary } from "@/shared/types";
import type { Series } from "@/shared/types/series";

type BuildSitemapEntriesInput = {
	siteUrl: string;
	publicPosts: PostSummary[];
	tags: string[];
	series: Series[];
};

export function buildSitemapEntries(input: BuildSitemapEntriesInput) {
	const now = new Date();
	const { siteUrl, publicPosts, tags, series } = input;

	const staticEntries: MetadataRoute.Sitemap = [
		{ url: `${siteUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
		{ url: `${siteUrl}/posts`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
		{ url: `${siteUrl}/series`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
		{ url: `${siteUrl}/tags`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
		{ url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 }
	];

	const postEntries: MetadataRoute.Sitemap = publicPosts.map((post) => ({
		url: `${siteUrl}/posts/${post.slug}`,
		lastModified: new Date(post.updated ?? post.date),
		changeFrequency: "weekly",
		priority: 0.8
	}));

	const seriesEntries: MetadataRoute.Sitemap = series.map((s) => ({
		url: `${siteUrl}/series/${encodeURIComponent(s.slug)}`,
		lastModified: now,
		changeFrequency: "weekly",
		priority: 0.6
	}));

	const tagEntries: MetadataRoute.Sitemap = tags.map((tag) => ({
		url: `${siteUrl}/tags/${encodeURIComponent(tag)}`,
		lastModified: now,
		changeFrequency: "weekly",
		priority: 0.5
	}));

	return [...staticEntries, ...postEntries, ...seriesEntries, ...tagEntries];
}
