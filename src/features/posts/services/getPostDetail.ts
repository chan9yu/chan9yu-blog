import { readFileSync } from "node:fs";
import { join } from "node:path";

import { calculateReadingTime } from "../utils/calculateReadingTime";
import { extractTocFromMarkdown } from "../utils/extractTocFromMarkdown";
import { parseFrontmatter } from "../utils/parseFrontmatter";
import { splitFrontmatter } from "../utils/splitFrontmatter";
import { POSTS_DIR } from "./paths";

// CommonMark §6.4 Emphasis: 닫는 `**` 앞에 `)` 등 구두점 + 뒤에 한글이 붙으면 닫힘 조건 불충족 → 리터럴 `**` 출력.
// MDX 파서 도달 전에 HTML로 교체해 우회. 작성자 통제 콘텐츠라 raw HTML 신뢰 전제.
function preprocessMdxContent(content: string) {
	const fences: string[] = [];
	const inlines: string[] = [];

	let masked = content.replace(/```[\s\S]*?```/g, (m) => {
		fences.push(m);
		return `\u0000FENCE${fences.length - 1}\u0000`;
	});

	masked = masked.replace(/`[^`\n]+`/g, (m) => {
		inlines.push(m);
		return `\u0000INLINE${inlines.length - 1}\u0000`;
	});

	// 단일 줄 한정(\n 불허) — 단락 넘김 케이스 차단.
	masked = masked.replace(/\*\*([^*\n]+?)\*\*/g, "<strong>$1</strong>");

	masked = masked.replace(/\u0000INLINE(\d+)\u0000/g, (_, i) => inlines[Number(i)] ?? "");
	masked = masked.replace(/\u0000FENCE(\d+)\u0000/g, (_, i) => fences[Number(i)] ?? "");

	return masked;
}

// private 필터링은 호출자 책임 — 이 함수는 private 포스트도 반환한다.
export function getPostDetail(slug: string) {
	const filePath = join(POSTS_DIR, slug, "index.mdx");

	try {
		const raw = readFileSync(filePath, "utf-8");
		const frontmatter = parseFrontmatter(raw, slug);
		const { content } = splitFrontmatter(raw);

		// 원본 content로 toc 추출 — preprocessMdxContent 결과는 <strong> 삽입으로 rehype-slug id와 어긋날 수 있음.
		const toc = extractTocFromMarkdown(content);
		const processedContent = preprocessMdxContent(content);
		const readingTimeMinutes = calculateReadingTime(processedContent);

		return {
			...frontmatter,
			readingTimeMinutes,
			contentMdx: processedContent,
			toc
		};
	} catch {
		return null;
	}
}
