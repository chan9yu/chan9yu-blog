import type { MetadataRoute } from "next";

import type { PostSummary } from "@/entities/post";
import { getPublicPosts } from "@/entities/post/index.server";
import type { Series } from "@/entities/series";
import { getAllSeries } from "@/entities/series";
import { TAG_INDEX_MIN_POSTS } from "@/entities/tag";
import { getSiteUrl } from "@/shared/config/site";

type BuildSitemapEntriesInput = {
	siteUrl: string;
	publicPosts: PostSummary[];
	series: Series<PostSummary>[];
};

function latestModifiedAt(posts: PostSummary[]) {
	let latest: Date | undefined;

	for (const post of posts) {
		const modified = new Date(post.updated ?? post.date);
		if (!latest || modified > latest) {
			latest = modified;
		}
	}

	return latest;
}

function groupPostsByTag(posts: PostSummary[]) {
	const grouped = new Map<string, PostSummary[]>();

	for (const post of posts) {
		for (const tag of post.tags) {
			const tagged = grouped.get(tag);
			if (tagged) {
				tagged.push(post);
			} else {
				grouped.set(tag, [post]);
			}
		}
	}

	return grouped;
}

export function buildSitemapEntries(input: BuildSitemapEntriesInput) {
	const { siteUrl, publicPosts, series } = input;
	const siteModifiedAt = latestModifiedAt(publicPosts);

	const staticEntries: MetadataRoute.Sitemap = [
		{ url: `${siteUrl}/`, lastModified: siteModifiedAt },
		{ url: `${siteUrl}/posts`, lastModified: siteModifiedAt },
		{ url: `${siteUrl}/series`, lastModified: siteModifiedAt },
		{ url: `${siteUrl}/tags`, lastModified: siteModifiedAt },
		{ url: `${siteUrl}/about` }
	];

	const postEntries: MetadataRoute.Sitemap = publicPosts.map((post) => ({
		url: `${siteUrl}/posts/${post.slug}`,
		lastModified: new Date(post.updated ?? post.date)
	}));

	const seriesEntries: MetadataRoute.Sitemap = series.map((s) => ({
		url: `${siteUrl}/series/${encodeURIComponent(s.slug)}`,
		lastModified: latestModifiedAt(s.posts)
	}));

	const tagEntries: MetadataRoute.Sitemap = Array.from(groupPostsByTag(publicPosts))
		.filter(([, tagged]) => tagged.length >= TAG_INDEX_MIN_POSTS)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([tag, tagged]) => ({
			url: `${siteUrl}/tags/${encodeURIComponent(tag)}`,
			lastModified: latestModifiedAt(tagged)
		}));

	return [...staticEntries, ...postEntries, ...seriesEntries, ...tagEntries];
}

export function sitemap(): MetadataRoute.Sitemap {
	const publicPosts = getPublicPosts();

	return buildSitemapEntries({
		siteUrl: getSiteUrl(),
		publicPosts,
		series: getAllSeries(publicPosts)
	});
}
