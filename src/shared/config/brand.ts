import { readFileSync } from "node:fs";
import { join } from "node:path";

const IMAGE_DIR = join(process.cwd(), "src", "shared", "assets", "images");

const LOGO_MARK_WHITE = readFileSync(join(IMAGE_DIR, "logo-mark-white.png"));

export const LOGO_MARK_WHITE_DATA_URI = `data:image/png;base64,${LOGO_MARK_WHITE.toString("base64")}`;
