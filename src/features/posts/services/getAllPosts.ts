import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type { PostSummary } from "@/shared/types";

import { calculateReadingTime } from "../utils/calculateReadingTime";
import { parseFrontmatter } from "../utils/parseFrontmatter";
import { sortPostsByDateDescending } from "../utils/sortPostsByDateDescending";
import { splitFrontmatter } from "../utils/splitFrontmatter";
import { POSTS_DIR } from "./paths";

type GetAllPostsOptions = {
	/** true면 private 포스트도 포함한다. 기본값: false */
	includePrivate?: boolean;
};

// frontmatter 검증 오류는 기본적으로 건너뛰지만, `STRICT_FRONTMATTER=1`이면 첫 오류에서 throw — CI 빌드에서 스키마 위반 차단.
// `@` 로 시작하는 디렉토리(@template 등)는 스캔 대상에서 제외.
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
