/** @vitest-environment node */
import * as fs from "node:fs";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { getAllPosts } from "../getAllPosts";

vi.mock("node:fs");

const makeDirent = (name: string, isDir = true) =>
	({
		name,
		isDirectory: () => isDir,
		isFile: () => !isDir,
		isBlockDevice: () => false,
		isCharacterDevice: () => false,
		isFIFO: () => false,
		isSocket: () => false,
		isSymbolicLink: () => false
	}) as unknown as fs.Dirent;

const makeMdx = (slug: string, date: string) =>
	`---
title: "테스트 포스트"
description: "이것은 테스트 포스트의 설명입니다."
slug: "${slug}"
date: "${date}"
private: false
tags: ["test"]
thumbnail: null
series: null
seriesOrder: null
---

## 본문

내용입니다.`;

describe("getAllPosts", () => {
	const mockedReaddirSync = vi.mocked(fs.readdirSync);
	const mockedReadFileSync = vi.mocked(fs.readFileSync);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("날짜 내림차순으로 정렬한다", () => {
		mockedReaddirSync.mockReturnValue([makeDirent("older-post"), makeDirent("newer-post")] as unknown as ReturnType<
			typeof fs.readdirSync
		>);
		mockedReadFileSync.mockImplementation((path) => {
			if (path.toString().includes("older-post"))
				return makeMdx("older-post", "2026-01-01") as unknown as ReturnType<typeof fs.readFileSync>;
			return makeMdx("newer-post", "2026-04-01") as unknown as ReturnType<typeof fs.readFileSync>;
		});

		const posts = getAllPosts();
		expect(posts[0]?.slug).toBe("newer-post");
		expect(posts[1]?.slug).toBe("older-post");
	});

	it("@ 로 시작하는 디렉토리(템플릿 등)를 건너뛴다", () => {
		mockedReaddirSync.mockReturnValue([makeDirent("@template"), makeDirent("real-post")] as unknown as ReturnType<
			typeof fs.readdirSync
		>);
		mockedReadFileSync.mockReturnValue(
			makeMdx("real-post", "2026-04-01") as unknown as ReturnType<typeof fs.readFileSync>
		);

		const posts = getAllPosts();
		expect(posts).toHaveLength(1);
		expect(posts[0]?.slug).toBe("real-post");
	});

	it("frontmatter 파싱 오류와 파일 읽기 실패가 있는 포스트는 건너뛴다", () => {
		mockedReaddirSync.mockReturnValue([
			makeDirent("valid-post"),
			makeDirent("invalid-post"),
			makeDirent("no-file-post")
		] as unknown as ReturnType<typeof fs.readdirSync>);
		mockedReadFileSync.mockImplementation((path) => {
			if (path.toString().includes("valid-post")) {
				return makeMdx("valid-post", "2026-04-01") as unknown as ReturnType<typeof fs.readFileSync>;
			}
			if (path.toString().includes("no-file-post")) {
				throw new Error("ENOENT: no such file or directory");
			}
			return "---\ntitle: invalid only\n---\n" as unknown as ReturnType<typeof fs.readFileSync>;
		});

		const posts = getAllPosts();
		expect(posts).toHaveLength(1);
		expect(posts[0]?.slug).toBe("valid-post");
	});
});
