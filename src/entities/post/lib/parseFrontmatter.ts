import { splitFrontmatter } from "@/shared/lib/splitFrontmatter";

import { PostFrontmatterSchema } from "../model/frontmatter";

export function parseFrontmatter(raw: string, dirSlug: string) {
	const normalized = raw.replace(/^--(?!-)/gm, "---");
	const { data } = splitFrontmatter(normalized);

	const result = PostFrontmatterSchema.safeParse(data);
	if (!result.success) {
		throw new Error(`[parseFrontmatter] slug="${dirSlug}" 스키마 검증 실패:\n${result.error.message}`);
	}

	if (result.data.slug !== dirSlug) {
		throw new Error(`[parseFrontmatter] slug 불일치: frontmatter.slug="${result.data.slug}" ≠ 디렉토리="${dirSlug}"`);
	}

	return result.data;
}
