export const BADGE_RECENT_COUNT = 6;

export const BADGE_THEMES = ["dark", "light"] as const;
export type BadgeTheme = (typeof BADGE_THEMES)[number];

export const BADGE_CARD = {
	width: 480,
	thumbHeight: 270,
	height: 440
} as const;

export const BADGE_CACHE_CONTROL = "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";

type BadgePalette = { bg: string; title: string; muted: string; border: string };

export const BADGE_PALETTE: Record<BadgeTheme, BadgePalette> = {
	dark: { bg: "#09090b", title: "#818cf8", muted: "#a1a1aa", border: "#27272a" },
	light: { bg: "#ffffff", title: "#4f46e5", muted: "#475569", border: "#e2e8f0" }
};

export function isBadgeTheme(value: string): value is BadgeTheme {
	return (BADGE_THEMES as readonly string[]).includes(value);
}

export function parseBadgeIndex(raw: string) {
	if (!/^\d+$/.test(raw)) return null;
	const index = Number(raw);
	if (index >= BADGE_RECENT_COUNT) return null;
	return index;
}
