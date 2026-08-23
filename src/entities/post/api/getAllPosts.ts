import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { splitFrontmatter } from "@/shared/lib/splitFrontmatter";

import { calculateReadingTime } from "../lib/calculateReadingTime";
import { parseFrontmatter } from "../lib/parseFrontmatter";
import { sortPostsByDateDescending } from "../lib/sortPostsByDateDescending";
import type { PostSummary } from "../model/post";
import { POSTS_DIR } from "./paths";

type GetAllPostsOptions = {
	includePrivate?: boolean;
};

export function getAllPosts(options: GetAllPostsOptions = {}) {
	const { includePrivate = false } = options;
	const strict = process.env.STRICT_FRONTMATTER === "1";

	const slugs = readdirSync(POSTS_DIR, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith("@"))
		.map((dirent) => dirent.name);

	const posts: PostSummary[] = [];

	for (const slug of slugs) {
		try {
			const filePath = join(POSTS_DIR, slug, "index.mdx");
			const raw = readFileSync(filePath, "utf-8");
			const frontmatter = parseFrontmatter(raw, slug);

			if (!includePrivate && frontmatter.private) continue;

			const { content } = splitFrontmatter(raw);
			const readingTimeMinutes = calculateReadingTime(content);

			posts.push({ ...frontmatter, readingTimeMinutes });
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			if (strict) {
				throw new Error(`[getAllPosts] "${slug}" frontmatter 오류 (STRICT_FRONTMATTER=1): ${message}`);
			}
			console.warn(`[getAllPosts] "${slug}" 건너뜀: ${message}`);
		}
	}

	return sortPostsByDateDescending(posts);
}
