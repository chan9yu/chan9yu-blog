import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/shared/config/site";

export function robots(): MetadataRoute.Robots {
	const isProduction = process.env.VERCEL_ENV === "production";

	if (!isProduction) {
		return {
			rules: { userAgent: "*", disallow: "/" }
		};
	}

	return {
		rules: { userAgent: "*", allow: "/", disallow: "/api/" },
		sitemap: `${getSiteUrl()}/sitemap.xml`
	};
}
