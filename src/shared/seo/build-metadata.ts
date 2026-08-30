import type { Metadata } from "next";

import { OG_IMAGE_SIZE, siteMetadata } from "@/shared/config/site";

type OgImageInput = string | { url: string; width: number; height: number };

type BuildMetadataInput = {
	title: string;
	description: string;
	path: string;
	image?: OgImageInput;
	type?: "website" | "article";
	publishedAt?: string;
	modifiedAt?: string;
	authors?: string[];
	tags?: string[];
	noIndex?: boolean;
	follow?: boolean;
};

function resolveOgImage(image: OgImageInput | undefined, title: string) {
	if (typeof image === "string") {
		return { url: image, alt: title };
	}

	const resolved = image ?? { url: `/og?title=${encodeURIComponent(title)}`, ...OG_IMAGE_SIZE };

	return { ...resolved, alt: title };
}

export function buildMetadata(input: BuildMetadataInput) {
	const ogImage = resolveOgImage(input.image, input.title);

	const ogCommon = {
		url: input.path,
		siteName: siteMetadata.siteName,
		locale: siteMetadata.locale,
		title: input.title,
		description: input.description,
		images: [ogImage]
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
			images: [{ url: ogImage.url, alt: input.title }]
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
