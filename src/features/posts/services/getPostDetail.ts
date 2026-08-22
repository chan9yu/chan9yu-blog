import { readFileSync } from "node:fs";
import { join } from "node:path";

import { splitFrontmatter } from "@/shared/utils/splitFrontmatter";

import { calculateReadingTime } from "../utils/calculateReadingTime";
import { extractTocFromMarkdown } from "../utils/extractTocFromMarkdown";
import { parseFrontmatter } from "../utils/parseFrontmatter";
import { POSTS_DIR } from "./paths";

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

	masked = masked.replace(/\*\*([^*\n]+?)\*\*/g, "<strong>$1</strong>");

	masked = masked.replace(/\u0000INLINE(\d+)\u0000/g, (_, i) => inlines[Number(i)] ?? "");
	masked = masked.replace(/\u0000FENCE(\d+)\u0000/g, (_, i) => fences[Number(i)] ?? "");

	return masked;
}

export function getPostDetail(slug: string) {
	const filePath = join(POSTS_DIR, slug, "index.mdx");

	try {
		const raw = readFileSync(filePath, "utf-8");
		const frontmatter = parseFrontmatter(raw, slug);
		const { content } = splitFrontmatter(raw);

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
