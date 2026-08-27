/** @vitest-environment node */
import * as fs from "node:fs";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { getAllPosts } from "../getAllPosts";
import { getPublicPosts } from "../getPublicPosts";

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

const makeMdx = (
	slug: string,
	date: string,
	isPrivate = false,
	tags: string[] = ["test"],
	series: string | null = null,
	seriesOrder: number | null = null
) =>
	`---
title: "포스트 ${slug}"
description: "${slug} 포스트 설명입니다."
slug: "${slug}"
date: "${date}"
private: ${isPrivate}
tags: ${JSON.stringify(tags)}
thumbnail: null
series: ${series === null ? "null" : `"${series}"`}
seriesOrder: ${seriesOrder === null ? "null" : seriesOrder}
---

## 본문

내용.`;

describe("Private 포스트 제외 정책 (M4-21)", () => {
	const mockedReaddirSync = vi.mocked(fs.readdirSync);
	const mockedReadFileSync = vi.mocked(fs.readFileSync);

	beforeEach(() => {
		vi.clearAllMocks();
		mockedReaddirSync.mockReturnValue([
			makeDirent("public-a"),
			makeDirent("public-b"),
			makeDirent("private-x")
		] as unknown as ReturnType<typeof fs.readdirSync>);

		mockedReadFileSync.mockImplementation((path) => {
			const pathStr = path.toString();
			if (pathStr.includes("public-a"))
				return makeMdx("public-a", "2026-04-01", false, ["react", "tdd"], "S1", 1) as unknown as ReturnType<
					typeof fs.readFileSync
				>;
			if (pathStr.includes("public-b"))
				return makeMdx("public-b", "2026-03-01", false, ["react"], "S1", 2) as unknown as ReturnType<
					typeof fs.readFileSync
				>;
			return makeMdx("private-x", "2026-05-01", true, ["react", "secret"], "S1", 3) as unknown as ReturnType<
				typeof fs.readFileSync
			>;
		});
	});

	it("getPublicPosts()는 private 포스트를 제외한다", () => {
		const posts = getPublicPosts();
		expect(posts.map((p) => p.slug)).toEqual(["public-a", "public-b"]);
		expect(posts.find((p) => p.slug === "private-x")).toBeUndefined();
	});

	it("includePrivate: true 시에는 private 포스트가 포함된다 (반대 케이스 보장)", () => {
		const all = getAllPosts({ includePrivate: true });
		expect(all.map((p) => p.slug)).toContain("private-x");
	});
});
