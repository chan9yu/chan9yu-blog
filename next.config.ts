import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	cacheComponents: false,
	reactCompiler: true,
	poweredByHeader: false,
	images: {
		formats: ["image/avif", "image/webp"],
		remotePatterns: [{ protocol: "https", hostname: "avatars.githubusercontent.com" }]
	},
	outputFileTracingExcludes: {
		"*": ["contents/**/images/**"]
	},
	turbopack: {
		rules: {
			"*.svg": {
				loaders: ["@svgr/webpack"],
				as: "*.js"
			}
		}
	}
};

export default nextConfig;
