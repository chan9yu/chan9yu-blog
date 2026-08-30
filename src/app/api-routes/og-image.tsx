import { ImageResponse } from "next/og";

import { LOGO_MARK_WHITE_DATA_URI, OG_BACKGROUND_DATA_URI } from "@/shared/config/brand";
import { loadPretendardFonts, PRETENDARD_FAMILY } from "@/shared/config/fonts";
import { OG_IMAGE_SIZE, siteHostname, siteMetadata } from "@/shared/config/site";

const MAX_TITLE = 80;
const MAX_TAG = 32;
const MARK_SIZE = 44;
const CACHE_HEADERS = {
	"Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800"
};

function truncate(input: string, max: number) {
	if (input.length <= max) return input;
	return `${input.slice(0, max - 1).trimEnd()}…`;
}

function isAllowedThumbnailUrl(thumbnail: string, requestHostname: string): boolean {
	try {
		const target = new URL(thumbnail);
		if (target.protocol !== "https:" && target.protocol !== "http:") return false;
		return target.hostname === requestHostname || target.hostname === siteHostname;
	} catch {
		return false;
	}
}

export function renderOgImage(req: Request) {
	const { searchParams, origin, hostname } = new URL(req.url);
	const rawTitle = searchParams.get("title")?.trim();
	const title = truncate(rawTitle || siteMetadata.name, MAX_TITLE);
	const tagParam = searchParams.get("tag")?.trim();
	const tag = tagParam ? truncate(tagParam, MAX_TAG) : null;
	const thumbnail = searchParams.get("thumbnail");

	if (thumbnail) {
		if (thumbnail.startsWith("/") && !thumbnail.startsWith("//")) {
			return new Response(null, {
				status: 302,
				headers: { ...CACHE_HEADERS, Location: `${origin}${thumbnail}` }
			});
		}

		if (isAllowedThumbnailUrl(thumbnail, hostname)) {
			return new Response(null, {
				status: 302,
				headers: { ...CACHE_HEADERS, Location: thumbnail }
			});
		}
	}

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "flex-start",
				justifyContent: "space-between",
				backgroundImage: `url(${OG_BACKGROUND_DATA_URI})`,
				backgroundSize: `${OG_IMAGE_SIZE.width}px ${OG_IMAGE_SIZE.height}px`,
				color: "#f8fafc",
				fontFamily: PRETENDARD_FAMILY,
				padding: "72px 88px"
			}}
		>
			<div style={{ display: "flex", alignItems: "center", height: MARK_SIZE }}>
				{tag ? (
					<span
						style={{
							fontSize: 24,
							fontWeight: 600,
							letterSpacing: "0.04em",
							color: "#818cf8",
							textTransform: "uppercase"
						}}
					>
						{`#${tag}`}
					</span>
				) : (
					<img src={LOGO_MARK_WHITE_DATA_URI} alt="" width={MARK_SIZE} height={MARK_SIZE} />
				)}
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

			<div style={{ display: "flex", fontSize: 22, color: "#a1a1aa" }}>{siteHostname}</div>
		</div>,
		{
			...OG_IMAGE_SIZE,
			fonts: loadPretendardFonts(),
			headers: CACHE_HEADERS
		}
	);
}
