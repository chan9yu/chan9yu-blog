import { readFileSync } from "node:fs";
import { join } from "node:path";

const FONT_DIR = join(process.cwd(), "src", "shared", "assets", "fonts");

const PRETENDARD_REGULAR = readFileSync(join(FONT_DIR, "Pretendard-Regular.otf"));
const PRETENDARD_BOLD = readFileSync(join(FONT_DIR, "Pretendard-Bold.otf"));

export const PRETENDARD_FAMILY = "Pretendard";

export function loadPretendardFonts() {
	return [
		{
			name: PRETENDARD_FAMILY,
			weight: 400 as const,
			style: "normal" as const,
			data: PRETENDARD_REGULAR
		},
		{
			name: PRETENDARD_FAMILY,
			weight: 700 as const,
			style: "normal" as const,
			data: PRETENDARD_BOLD
		}
	];
}
