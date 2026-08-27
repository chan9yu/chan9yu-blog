import type { Metadata } from "next";

import { siteMetadata } from "@/shared/config/site";

type BuildMetadataInput = {
	title: string;
	description: string;
	path: string;
	image?: string;
	type?: "website" | "article";
	publishedAt?: string;
	modifiedAt?: string;
	authors?: string[];
	tags?: string[];
	noIndex?: boolean;
	follow?: boolean;
};

export function buildMetadata(input: BuildMetadataInput) {
	const ogImage = input.image || `/og?title=${encodeURIComponent(input.title)}`;
	const ogImageDescriptor = input.image
		? { url: ogImage, alt: input.title }
		: { url: ogImage, width: 1200, height: 630, alt: input.title };

	const ogCommon = {
		url: input.path,
		siteName: siteMetadata.siteName,
		locale: siteMetadata.locale,
		title: input.title,
		description: input.description,
		images: [ogImageDescriptor]
	};

	const openGraph: Metadata["openGraph"] =
		input.type === "article"
			? {
					...ogCommon,
					type: "article",
					publishedTime: input.publishedAt,
					modifiedTime: input.modifiedAt ?? input.publishedAt,
					authors: input.authors && input.authors.length > 0 ? input.authors : undefined,
					tags: input.tags && input.tags.length > 0 ? input.tags : undefined
				}
			: {
					...ogCommon,
					type: "website"
				};

	const meta: Metadata = {
		title: input.title,
		description: input.description,
		alternates: {
			canonical: input.path,
			types: {
				"application/rss+xml": "/rss"
			}
		},
		openGraph,
		twitter: {
			card: "summary_large_image",
			title: input.title,
			description: input.description,
			images: [{ url: ogImage, alt: input.title }]
		}
	};

	if (input.noIndex) {
		meta.robots = { index: false, follow: input.follow ?? false };
	}

	return meta;
}

export const NOT_FOUND_METADATA: Metadata = {
	title: "404 Not Found",
	description: "요청하신 페이지를 찾을 수 없습니다.",
	robots: { index: false, follow: false },
	alternates: { canonical: null },
	openGraph: null,
	twitter: null
};
