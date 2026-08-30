import { ImageResponse } from "next/og";

import { getPublicPosts, resolveCardImageDataUri } from "@/entities/post/index.server";
import {
	BADGE_CACHE_CONTROL,
	BADGE_CARD,
	BADGE_PALETTE,
	BADGE_THEMES,
	isBadgeTheme,
	parseBadgeIndex
} from "@/shared/config/badge";
import { BADGE_PLACEHOLDER_DATA_URI } from "@/shared/config/badge-assets";
import { loadPretendardFonts, PRETENDARD_FAMILY } from "@/shared/config/fonts";
import { formatDate } from "@/shared/lib/format/formatDate";

import { badgeIndices } from "./badge-redirect";

export function generateBadgeCardParams() {
	return BADGE_THEMES.flatMap((theme) => badgeIndices().map((index) => ({ index: String(index), theme })));
}

export async function renderBadgeCard(
	_req: Request,
	{ params }: { params: Promise<{ index: string; theme: string }> }
) {
	const { index: rawIndex, theme } = await params;
	const index = parseBadgeIndex(rawIndex);
	if (index === null || !isBadgeTheme(theme)) {
		return new Response("Not Found", { status: 404 });
	}

	const post = getPublicPosts()[index];
	if (!post) return new Response("Not Found", { status: 404 });

	const palette = BADGE_PALETTE[theme];
	const imageDataUri = resolveCardImageDataUri(post);

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				backgroundColor: palette.bg,
				fontFamily: PRETENDARD_FAMILY
			}}
		>
			<div style={{ display: "flex", width: "100%", height: BADGE_CARD.thumbHeight, backgroundColor: palette.border }}>
				<img
					src={imageDataUri ?? BADGE_PLACEHOLDER_DATA_URI[theme]}
					alt=""
					width={BADGE_CARD.width}
					height={BADGE_CARD.thumbHeight}
					style={{ objectFit: "cover" }}
				/>
			</div>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					flex: 1,
					padding: "20px 28px",
					justifyContent: "center",
					gap: 12
				}}
			>
				<div
					style={{
						display: "flex",
						fontSize: 26,
						fontWeight: 700,
						lineHeight: 1.3,
						color: palette.title,
						maxHeight: 70,
						overflow: "hidden"
					}}
				>
					{post.title}
				</div>
				<div style={{ display: "flex", fontSize: 20, color: palette.muted }}>{formatDate(post.date)}</div>
			</div>
		</div>,
		{
			width: BADGE_CARD.width,
			height: BADGE_CARD.height,
			fonts: loadPretendardFonts(),
			headers: { "Cache-Control": BADGE_CACHE_CONTROL }
		}
	);
}
