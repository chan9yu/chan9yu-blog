import "@/app/styles/globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import localFont from "next/font/local";
import type { PropsWithChildren } from "react";
import { Suspense } from "react";

import { Providers } from "@/app/providers";
import { getPublicPosts } from "@/entities/post/index.server";
import { SearchTrigger } from "@/features/search";
import { ThemeSwitcher } from "@/features/theme";
import { getSiteUrl, siteMetadata } from "@/shared/config/site";
import { buildWebSiteJsonLd, JsonLdScript } from "@/shared/seo";
import { ScrollReset } from "@/shared/ui/ScrollReset";
import { ScrollToTop } from "@/shared/ui/ScrollToTop";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";
import { MobileMenu } from "@/widgets/mobile-menu";

const pretendard = localFont({
	src: "../../shared/assets/fonts/PretendardVariable.woff2",
	display: "swap",
	weight: "45 920",
	variable: "--font-pretendard",
	preload: true,
	fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Apple SD Gothic Neo", "Malgun Gothic", "sans-serif"],
	adjustFontFallback: "Arial"
});

const ROOT_OG_IMAGE = `/og?title=${encodeURIComponent(siteMetadata.name)}`;

export const rootMetadata: Metadata = {
	metadataBase: new URL(getSiteUrl()),
	title: {
		default: siteMetadata.title,
		template: `%s | ${siteMetadata.name}`
	},
	description: siteMetadata.description,
	alternates: {
		canonical: "/",
		types: {
			"application/rss+xml": "/rss"
		}
	},
	openGraph: {
		type: "website",
		siteName: siteMetadata.name,
		locale: siteMetadata.locale,
		url: "/",
		title: siteMetadata.title,
		description: siteMetadata.description,
		images: [{ url: ROOT_OG_IMAGE, width: 1200, height: 630, alt: siteMetadata.title }]
	},
	twitter: {
		card: "summary_large_image",
		title: siteMetadata.title,
		description: siteMetadata.description,
		images: [ROOT_OG_IMAGE]
	},
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "any" },
			{ url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" }
		],
		apple: [{ url: "/favicons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
	}
};

const websiteJsonLd = buildWebSiteJsonLd({
	siteUrl: siteMetadata.url,
	siteName: siteMetadata.name,
	description: siteMetadata.description,
	authorName: siteMetadata.author
});

export function RootLayout({ children }: PropsWithChildren) {
	const searchablePosts = getPublicPosts();

	return (
		<html lang="ko" className={pretendard.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
			<body className="bg-background text-foreground flex min-h-screen flex-col font-sans antialiased">
				<JsonLdScript id="website-json-ld" data={websiteJsonLd} />
				<Providers>
					<ScrollReset />
					<a
						href="#main-content"
						className="focus-visible:ring-ring bg-card border-border-default text-foreground z-floating fixed -top-16 left-4 inline-flex h-11 items-center rounded-md border px-4 text-sm font-medium transition-[top] focus-visible:top-4 focus-visible:ring-2 focus-visible:outline-none"
					>
						본문 바로가기
					</a>
					<Suspense
						fallback={
							<div aria-hidden className="border-border-subtle bg-background z-sticky sticky top-0 h-16 border-b" />
						}
					>
						<Header
							searchSlot={<SearchTrigger posts={searchablePosts} />}
							themeSlot={<ThemeSwitcher />}
							mobileMenuSlot={<MobileMenu />}
						/>
					</Suspense>
					<main id="main-content" tabIndex={-1} className="flex-1">
						{children}
					</main>
					<Footer />
					<ScrollToTop />
				</Providers>
				{process.env.VERCEL ? (
					<>
						<Analytics />
						<SpeedInsights />
					</>
				) : null}
			</body>
		</html>
	);
}
