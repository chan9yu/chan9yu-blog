import type { MetadataRoute } from "next";

import { siteMetadata } from "@/shared/config/site";

export function manifest(): MetadataRoute.Manifest {
	return {
		id: "/",
		name: siteMetadata.title,
		short_name: siteMetadata.name,
		description: siteMetadata.description,
		lang: "ko",
		start_url: "/",
		scope: "/",
		display: "standalone",
		background_color: siteMetadata.backgroundColor,
		theme_color: siteMetadata.themeColor,
		icons: [
			{ src: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{ src: "/favicons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
			{ src: "/favicons/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
			{ src: "/favicons/android-chrome-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
			{ src: "/favicons/android-chrome-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
		]
	};
}
