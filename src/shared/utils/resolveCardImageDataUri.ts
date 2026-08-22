import { join } from "node:path";

import type { PostSummary } from "@/shared/types";

import { fileToDataUri } from "./fileToDataUri";
import { resolveThumbnailSrc } from "./resolveThumbnail";

const RASTER_EXT = /\.(png|jpe?g|webp|gif)$/i;

export function resolveCardImageDataUri(post: PostSummary) {
	const resolved = resolveThumbnailSrc(post.thumbnail, post.slug);
	if (!resolved || !RASTER_EXT.test(resolved)) {
		return null;
	}

	const absolutePath = join(process.cwd(), "public", resolved.replace(/^\//, ""));
	return fileToDataUri(absolutePath);
}
