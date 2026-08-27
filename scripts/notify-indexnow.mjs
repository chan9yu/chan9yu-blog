import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { VFile } from "vfile";
import { matter } from "vfile-matter";

const POSTS_DIR = "contents/posts";
const PUBLIC_DIR = "public";
const INDEXNOW_KEY = "6bac183b5f6519f851dec941bff4131bc5e72a4ecc691a83491f0e39b4a18182";
const INDEXNOW_ENDPOINT = "https://searchadvisor.naver.com/indexnow";
const RECENT_WINDOW_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_SITE_URL = "https://chan9yu.dev";

function readVerifiedKey() {
	const keyPath = join(PUBLIC_DIR, `${INDEXNOW_KEY}.txt`);
	const content = readFileSync(keyPath, "utf-8").trim();

	if (content !== INDEXNOW_KEY) {
		throw new Error(`${keyPath}의 내용이 INDEXNOW_KEY 상수와 다르다. 검색 엔진이 소유 확인에 실패한다`);
	}

	return INDEXNOW_KEY;
}

function resolveBaseUrl() {
	const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
	return (explicit || DEFAULT_SITE_URL).replace(/\/+$/, "");
}

export function collectRecentPostUrls({ postsDir, baseUrl, now, windowDays }) {
	const since = now - windowDays * DAY_MS;

	return readdirSync(postsDir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory() && !entry.name.startsWith("@"))
		.map((entry) => {
			const filePath = join(postsDir, entry.name, "index.mdx");
			const file = new VFile(readFileSync(filePath, "utf-8"));
			matter(file);
			return { slug: entry.name, filePath, frontmatter: file.data.matter };
		})
		.filter(({ filePath, frontmatter }) => {
			if (frontmatter.private === true) return false;

			const raw = frontmatter.updated ?? frontmatter.date;
			const stamp = Date.parse(raw);
			if (Number.isNaN(stamp)) {
				throw new Error(`${filePath}의 날짜 "${raw}"를 읽을 수 없다`);
			}

			return stamp >= since;
		})
		.map(({ slug }) => `${baseUrl}/posts/${slug}`)
		.sort();
}

async function main() {
	const key = readVerifiedKey();
	const baseUrl = resolveBaseUrl();
	const postUrls = collectRecentPostUrls({
		postsDir: POSTS_DIR,
		baseUrl,
		now: Date.now(),
		windowDays: RECENT_WINDOW_DAYS
	});

	console.log(`[indexnow] 최근 ${RECENT_WINDOW_DAYS}일 안에 발행하거나 고친 공개 글 ${postUrls.length}개`);

	if (process.env.VERCEL_ENV !== "production") {
		console.log(`[indexnow] 건너뜀(비프로덕션). VERCEL_ENV=${process.env.VERCEL_ENV ?? "없음"}`);
		return;
	}

	if (postUrls.length === 0) {
		console.log("[indexnow] 보낼 URL 없음");
		return;
	}

	const urlList = [baseUrl, `${baseUrl}/posts`, ...postUrls];
	const payload = {
		host: new URL(baseUrl).hostname,
		key,
		keyLocation: `${baseUrl}/${key}.txt`,
		urlList
	};

	try {
		const response = await fetch(INDEXNOW_ENDPOINT, {
			method: "POST",
			headers: { "Content-Type": "application/json; charset=utf-8" },
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			console.warn(
				`[indexnow] 알림 실패: ${response.status} ${response.statusText}. URL ${urlList.length}개를 못 보냈다`
			);
			return;
		}

		console.log(`[indexnow] 알림 성공: ${response.status}. URL ${urlList.length}개를 보냈다`);
	} catch (error) {
		console.warn(`[indexnow] 알림 실패: 네트워크 오류. URL ${urlList.length}개를 못 보냈다`, error);
	}
}

if (import.meta.main) {
	await main();
}
