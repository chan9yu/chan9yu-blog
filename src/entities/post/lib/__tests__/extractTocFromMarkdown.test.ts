import { describe, expect, it } from "vitest";

import { extractTocFromMarkdown } from "../extractTocFromMarkdown";

describe("extractTocFromMarkdown", () => {
	it("h2 추출", () => {
		const md = "## Hello World\n본문";
		const toc = extractTocFromMarkdown(md);
		expect(toc).toHaveLength(1);
		expect(toc[0]).toMatchObject({ level: 2, text: "Hello World" });
	});

	it("h3 추출", () => {
		const md = "### 서브 섹션";
		const toc = extractTocFromMarkdown(md);
		expect(toc[0]).toMatchObject({ level: 3, text: "서브 섹션" });
	});

	it("h1도 포함한다 (CustomMDX +1 시프트 렌더링 전제, M2-09 개정)", () => {
		const md = "# 제목\n## 섹션";
		const toc = extractTocFromMarkdown(md);
		expect(toc).toHaveLength(2);
		expect(toc[0]?.level).toBe(1);
		expect(toc[1]?.level).toBe(2);
	});

	it("h4 이하 제외", () => {
		const md = "## 섹션\n#### 너무 깊음";
		const toc = extractTocFromMarkdown(md);
		expect(toc).toHaveLength(1);
	});

	it("영문 heading id → slugify 결과", () => {
		const md = "## Hello World";
		const toc = extractTocFromMarkdown(md);
		expect(toc[0]?.id).toBe("hello-world");
	});

	it("한글 heading id → slugify 결과", () => {
		const md = "## 리액트 훅";
		const toc = extractTocFromMarkdown(md);
		expect(toc[0]?.id).toBe("리액트-훅");
	});

	it("빈 문서 → 빈 배열", () => {
		expect(extractTocFromMarkdown("")).toEqual([]);
	});

	it("코드 블록 내 heading 제외", () => {
		const md = "```\n## 코드 안 heading\n```\n## 진짜 heading";
		const toc = extractTocFromMarkdown(md);
		expect(toc).toHaveLength(1);
		expect(toc[0]?.text).toBe("진짜 heading");
	});

	it("h2·h3 혼합 순서 보존", () => {
		const md = "## 섹션 1\n### 서브섹션\n## 섹션 2";
		const toc = extractTocFromMarkdown(md);
		expect(toc).toHaveLength(3);
		expect(toc[0]?.level).toBe(2);
		expect(toc[1]?.level).toBe(3);
		expect(toc[2]?.level).toBe(2);
	});
});
