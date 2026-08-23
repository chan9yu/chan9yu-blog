import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { VFile } from "vfile";
import { matter } from "vfile-matter";

const POSTS_DIR = "contents/posts";
const SERIES_DIR = "contents/series";
const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 160;
const SLUG_REGEX = /^[a-z0-9-]+$/;

const slugs = readdirSync(POSTS_DIR, { withFileTypes: true })
	.filter((d) => d.isDirectory() && !d.name.startsWith("@"))
	.map((d) => d.name)
	.sort();

const violations = [];
const seriesNames = new Set();

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

	if (fm.series) {
		seriesNames.add(fm.series);
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
		errors.push(`slug "${fm.slug}" — 영문 소문자와 숫자, 하이픈만 허용`);
	} else if (fm.slug !== slug) {
		errors.push(`slug "${fm.slug}"와 디렉토리명 "${slug}"이 다르다`);
	}

	if (errors.length > 0) {
		violations.push({ slug, errors });
	}
}

const seriesMetaFiles = new Set(
	readdirSync(SERIES_DIR, { withFileTypes: true })
		.filter((d) => d.isFile() && d.name.endsWith(".md"))
		.map((d) => d.name.replace(/\.md$/, ""))
);

for (const name of seriesNames) {
	if (!seriesMetaFiles.has(name)) {
		violations.push({ slug: `series/${name}`, errors: [`${SERIES_DIR}/${name}.md 없음 — 시리즈 소개가 비어버린다`] });
		continue;
	}

	const file = new VFile(readFileSync(join(SERIES_DIR, `${name}.md`), "utf-8"));
	matter(file);
	const meta = file.data.matter ?? {};
	const errors = [];

	if (!meta.title) errors.push("title 누락");
	if (!meta.description) errors.push("description 누락");

	if (errors.length > 0) violations.push({ slug: `series/${name}`, errors });
}

if (violations.length > 0) {
	console.error("\n[validate-seo] FAIL — frontmatter SEO 위반\n");
	for (const v of violations) {
		console.error(`  ${v.slug}:`);
		for (const e of v.errors) console.error(`    - ${e}`);
	}
	console.error(
		`\n총 ${violations.length}개 포스트 위반. .agents/rules/seo.md 기준 (description ${DESC_MIN}~${DESC_MAX}자, title ≤${TITLE_MAX}자).\n`
	);
	process.exit(1);
}

console.log(`[validate-seo] PASS — 포스트 ${slugs.length}개, 시리즈 ${seriesNames.size}개 검증 통과`);
