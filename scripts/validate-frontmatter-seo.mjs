// frontmatter SEO 검증 — title·description 길이, slug 형식, 디렉토리명 정합성을 빌드 타임에 차단.
// 위반 시 exit 1 → prebuild fail → CI/Vercel 빌드 차단. .claude/rules/seo.md 참조.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { VFile } from "vfile";
import { matter } from "vfile-matter";

const POSTS_DIR = "contents/posts";
const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 160;
const SLUG_REGEX = /^[a-z0-9-]+$/;

const slugs = readdirSync(POSTS_DIR, { withFileTypes: true })
	.filter((d) => d.isDirectory() && !d.name.startsWith("@"))
	.map((d) => d.name)
	.sort();

const violations = [];

for (const slug of slugs) {
	const filePath = join(POSTS_DIR, slug, "index.mdx");
	let fm;
	try {
		const file = new VFile(readFileSync(filePath, "utf-8"));
		matter(file);
		fm = file.data.matter;
	} catch (e) {
		violations.push({ slug, errors: [`파일 파싱 실패: ${e.message}`] });
		continue;
	}

	const errors = [];

	if (!fm.title) {
		errors.push("title 누락");
	} else if (fm.title.length > TITLE_MAX) {
		errors.push(`title ${fm.title.length}자 — 한도 ${TITLE_MAX}자 초과`);
	}

	if (!fm.description) {
		errors.push("description 누락");
	} else if (fm.description.length < DESC_MIN) {
		errors.push(`description ${fm.description.length}자 — 최소 ${DESC_MIN}자 미달 (검색 스니펫 본문 자동 추출)`);
	} else if (fm.description.length > DESC_MAX) {
		errors.push(`description ${fm.description.length}자 — 최대 ${DESC_MAX}자 초과 (검색 스니펫 잘림)`);
	}

	if (!fm.slug) {
		errors.push("slug 누락");
	} else if (!SLUG_REGEX.test(fm.slug)) {
		errors.push(`slug "${fm.slug}" — 영문 소문자·숫자·하이픈만 허용`);
	} else if (fm.slug !== slug) {
		errors.push(`slug "${fm.slug}" ↔ 디렉토리명 "${slug}" 불일치`);
	}

	if (errors.length > 0) {
		violations.push({ slug, errors });
	}
}

if (violations.length > 0) {
	console.error("\n[validate-frontmatter-seo] ❌ FAIL — frontmatter SEO 위반\n");
	for (const v of violations) {
		console.error(`  ${v.slug}:`);
		for (const e of v.errors) console.error(`    - ${e}`);
	}
	console.error(
		`\n총 ${violations.length}개 포스트 위반. .claude/rules/seo.md 기준 (description ${DESC_MIN}~${DESC_MAX}자, title ≤${TITLE_MAX}자).\n`
	);
	process.exit(1);
}

console.log(`[validate-frontmatter-seo] ✅ PASS — ${slugs.length}개 포스트 검증 통과`);
