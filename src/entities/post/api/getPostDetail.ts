import { readFileSync } from "node:fs";
import { join } from "node:path";

import { calculateReadingTime } from "../lib/calculateReadingTime";
import { extractTocFromMarkdown } from "../lib/extractTocFromMarkdown";
import { parseFrontmatter } from "../lib/parseFrontmatter";
import { POSTS_DIR } from "./paths";

function convertBoldToStrong(content: string) {
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

	masked = masked.replace(/\*\*([^*\n]+?)\*\*/g, "<strong>$1</strong>");

	masked = masked.replace(/\u0000INLINE(\d+)\u0000/g, (_, i) => inlines[Number(i)] ?? "");
	masked = masked.replace(/\u0000FENCE(\d+)\u0000/g, (_, i) => fences[Number(i)] ?? "");

	return masked;
}

export function getPostDetail(slug: string) {
	const filePath = join(POSTS_DIR, slug, "index.mdx");

	try {
		const raw = readFileSync(filePath, "utf-8");
		const { frontmatter, content } = parseFrontmatter(raw, slug);

		const toc = extractTocFromMarkdown(content);
		const readingTimeMinutes = calculateReadingTime(content);
		const processedContent = convertBoldToStrong(content);

		return {
			...frontmatter,
			readingTimeMinutes,
			contentMdx: processedContent,
			toc
		};
	} catch (error) {
		console.warn(`[getPostDetail] "${slug}" 실패: ${error instanceof Error ? error.message : String(error)}`);
		return null;
	}
}
