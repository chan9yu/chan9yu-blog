import { ImageResponse } from "next/og";

import { siteMetadata } from "@/shared/config/site";

export const dynamic = "force-dynamic";

const MAX_TITLE = 80;
const MAX_TAG = 32;

const ALLOWED_THUMBNAIL_HOSTS = new Set<string>([new URL(siteMetadata.url).hostname]);

function truncate(input: string, max: number) {
	if (input.length <= max) return input;
	return `${input.slice(0, max - 1).trimEnd()}…`;
}

function isAllowedThumbnailUrl(thumbnail: string, requestOrigin: string): boolean {
	try {
		const target = new URL(thumbnail);
		if (target.protocol !== "https:" && target.protocol !== "http:") return false;
		const requestHost = new URL(requestOrigin).hostname;
		return target.hostname === requestHost || ALLOWED_THUMBNAIL_HOSTS.has(target.hostname);
	} catch {
		return false;
	}
}

export function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const rawTitle = searchParams.get("title")?.trim();
	const title = truncate(rawTitle && rawTitle.length > 0 ? rawTitle : siteMetadata.name, MAX_TITLE);
	const tagParam = searchParams.get("tag")?.trim();
	const tag = tagParam ? truncate(tagParam, MAX_TAG) : null;
	const thumbnail = searchParams.get("thumbnail");
	const origin = new URL(req.url).origin;

	if (thumbnail) {
		if (thumbnail.startsWith("/") && !thumbnail.startsWith("//")) {
			return Response.redirect(`${origin}${thumbnail}`, 302);
		}

		if (/^https?:\/\//i.test(thumbnail) && isAllowedThumbnailUrl(thumbnail, origin)) {
			return Response.redirect(thumbnail, 302);
		}
	}

	const eyebrow = tag ? `#${tag}` : `${siteMetadata.name}.dev`;

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "flex-start",
				justifyContent: "space-between",
				backgroundImage: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #4f46e5 100%)",
				color: "#f8fafc",
				fontFamily: "sans-serif",
				padding: "72px 88px"
			}}
		>
			<div
				style={{
					display: "flex",
					fontSize: 24,
					fontWeight: 600,
					letterSpacing: "0.04em",
					color: "#c7d2fe",
					textTransform: "uppercase"
				}}
			>
				{eyebrow}
			</div>

			<div
				style={{
					display: "flex",
					fontSize: 64,
					fontWeight: 800,
					lineHeight: 1.18,
					letterSpacing: "-0.02em",
					maxWidth: "92%",
					color: "#f8fafc"
				}}
			>
				{title}
			</div>

			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					width: "100%",
					fontSize: 22,
					color: "#a5b4fc"
				}}
			>
				<span>{siteMetadata.url.replace(/^https?:\/\//, "")}</span>
				<span style={{ fontWeight: 700, color: "#f8fafc" }}>{siteMetadata.name}</span>
			</div>
		</div>,
		{ width: 1200, height: 630 }
	);
}
