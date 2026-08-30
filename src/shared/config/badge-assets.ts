import { join } from "node:path";

import { fileToDataUri } from "@/shared/lib/fileToDataUri";

const IMAGE_DIR = join(process.cwd(), "src", "shared", "assets", "images");

export const BADGE_PLACEHOLDER_DATA_URI = {
	dark: fileToDataUri(join(IMAGE_DIR, "badge-placeholder-dark.jpg")),
	light: fileToDataUri(join(IMAGE_DIR, "badge-placeholder-light.jpg"))
} as const;
