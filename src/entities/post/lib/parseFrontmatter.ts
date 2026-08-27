import { splitFrontmatter } from "@/shared/lib/splitFrontmatter";

import { PostFrontmatterSchema } from "../model/frontmatter";

export function parseFrontmatter(raw: string, dirSlug: string) {
	const normalized = raw.replace(/^--(?!-)/gm, "---");
	const { data, content } = splitFrontmatter(normalized);

	const result = PostFrontmatterSchema.safeParse(data);
	if (!result.success) {
		throw new Error(`[parseFrontmatter] slug="${dirSlug}" 스키마 검증 실패:\n${result.error.message}`);
	}

	if (result.data.slug !== dirSlug) {
		throw new Error(
			`[parseFrontmatter] slug 불일치: frontmatter.slug="${result.data.slug}"가 디렉토리명 "${dirSlug}"과 다릅니다`
		);
	}

	return {
		frontmatter: result.data,
		content
	};
}
