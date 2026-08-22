import { getPublicPosts } from "@/features/posts";
import { getSiteUrl, siteMetadata, siteSocials } from "@/shared/config/site";

import { buildRssFeed } from "../rss-feed";

export const dynamic = "force-static";

function resolveAuthorEmail() {
	const mailLink = siteSocials.find((s) => s.iconName === "Mail");
	if (mailLink && mailLink.href.startsWith("mailto:")) {
		return mailLink.href.slice("mailto:".length);
	}
	return "";
}

export function GET() {
	const xml = buildRssFeed({
		siteUrl: getSiteUrl(),
		siteTitle: siteMetadata.title,
		siteDescription: siteMetadata.description,
		authorName: siteMetadata.author,
		authorEmail: resolveAuthorEmail(),
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
