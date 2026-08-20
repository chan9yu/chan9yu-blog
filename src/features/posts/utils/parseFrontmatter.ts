import { PostFrontmatterSchema } from "../schemas/frontmatter";
import { splitFrontmatter } from "./splitFrontmatter";

// frontmatter.slug ↔ 디렉토리명 일치 검증으로 contents/posts/* 라우트 정합성 보장.
// `--` 구분자는 일부 에디터가 `---` 대신 출력하는 경우가 있어 보정.
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
