import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { splitFrontmatter } from "@/shared/utils/splitFrontmatter";

import { type SeriesMeta, SeriesMetaSchema } from "../schemas/seriesMeta";
import { SERIES_DIR } from "./paths";

export function getAllSeriesMeta() {
	const files = readdirSync(SERIES_DIR, { withFileTypes: true })
		.filter((dirent) => dirent.isFile() && dirent.name.endsWith(".md"))
		.map((dirent) => dirent.name);

	const metaBySlug = new Map<string, SeriesMeta>();

	for (const fileName of files) {
		const slug = fileName.replace(/\.md$/, "");
		const raw = readFileSync(join(SERIES_DIR, fileName), "utf-8");
		const { data } = splitFrontmatter(raw);

		const result = SeriesMetaSchema.safeParse(data);
		if (!result.success) {
			throw new Error(`[getAllSeriesMeta] "${fileName}" 스키마 검증 실패:\n${result.error.message}`);
		}

		metaBySlug.set(slug, result.data);
	}

	return metaBySlug;
}
