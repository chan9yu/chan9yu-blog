import { readFileSync } from "node:fs";
import { join } from "node:path";

const ABOUT_PATH = join(process.cwd(), "contents", "about", "index.md");

export function getAboutContent() {
	return readFileSync(ABOUT_PATH, "utf-8");
}
