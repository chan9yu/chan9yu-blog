import { fileToDataUri } from "@/shared/lib/fileToDataUri";

import type { PostSummary } from "../model/post";
import { publicFilePath, resolveThumbnailSrc } from "./resolveThumbnail";

const RASTER_EXT = /\.(png|jpe?g|webp|gif)$/i;

export function resolveCardImageDataUri(post: PostSummary) {
	const resolved = resolveThumbnailSrc(post.thumbnail, post.slug);
	if (!resolved || !RASTER_EXT.test(resolved)) {
		return null;
	}

	return fileToDataUri(publicFilePath(resolved));
}
