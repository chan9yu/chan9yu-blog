import { join } from "node:path";

import { fileToDataUri } from "@/shared/lib/fileToDataUri";

const IMAGE_DIR = join(process.cwd(), "src", "shared", "assets", "images");

export const LOGO_MARK_WHITE_DATA_URI = fileToDataUri(join(IMAGE_DIR, "logo-mark-white.png"));

export const OG_BACKGROUND_DATA_URI = fileToDataUri(join(IMAGE_DIR, "og-background.jpg"));
