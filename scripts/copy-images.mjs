#!/usr/bin/env node

import { cpSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const CONTENTS_DIR = join(process.cwd(), "contents", "posts");
const PUBLIC_DIR = join(process.cwd(), "public", "posts");

function collectFiles(dir) {
	const result = [];
	const entries = readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			result.push(...collectFiles(fullPath));
		} else {
			result.push(fullPath);
		}
	}

	return result;
}

function dirExists(dir) {
	try {
		return statSync(dir).isDirectory();
	} catch {
		return false;
	}
}

function main() {
	let copied = 0;
	let skipped = 0;
	let pruned = 0;

	let slugDirs;
	try {
		slugDirs = readdirSync(CONTENTS_DIR, { withFileTypes: true }).filter(
			(d) => d.isDirectory() && !d.name.startsWith("@")
		);
	} catch (err) {
		const isNotFound = err.code === "ENOENT";
		if (isNotFound) {
			console.log("[copy-images] contents/posts/ 디렉토리 없음, 스킵.");
			return;
		}
		throw err;
	}

	const sourceSlugs = new Set(slugDirs.map((d) => d.name));

	for (const slugDir of slugDirs) {
		const slug = slugDir.name;
		const srcImagesDir = join(CONTENTS_DIR, slug, "images");
		const destImagesDir = join(PUBLIC_DIR, slug, "images");

		if (!dirExists(srcImagesDir)) continue;

		const srcFiles = collectFiles(srcImagesDir);

		for (const srcFile of srcFiles) {
			const relPath = relative(srcImagesDir, srcFile);
			const destFile = join(destImagesDir, relPath);

			let shouldCopy = true;
			try {
				const srcStat = statSync(srcFile);
				const destStat = statSync(destFile);
				if (destStat.mtimeMs >= srcStat.mtimeMs) {
					shouldCopy = false;
					skipped++;
				}
			} catch (err) {
				if (err.code !== "ENOENT") throw err;
			}

			if (shouldCopy) {
				mkdirSync(dirname(destFile), { recursive: true });
				cpSync(srcFile, destFile);
				copied++;
				console.log(`  복사 ${slug}/images/${relPath}`);
			}
		}
	}

	let destSlugs = [];
	try {
		destSlugs = readdirSync(PUBLIC_DIR, { withFileTypes: true })
			.filter((d) => d.isDirectory())
			.map((d) => d.name);
	} catch (err) {
		if (err.code !== "ENOENT") throw err;
	}

	for (const destSlug of destSlugs) {
		if (sourceSlugs.has(destSlug)) continue;

		const destImagesDir = join(PUBLIC_DIR, destSlug, "images");
		if (!dirExists(destImagesDir)) continue;

		rmSync(destImagesDir, { recursive: true, force: true });
		pruned++;
		console.log(`  제거 public/posts/${destSlug}/images`);
	}

	console.log(`\n[copy-images] 완료. 복사 ${copied}개, 스킵 ${skipped}개, 제거 ${pruned}개`);
}

main();
