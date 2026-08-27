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
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
					{ key: "X-Frame-Options", value: "SAMEORIGIN" },
					{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
				]
			}
		];
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
