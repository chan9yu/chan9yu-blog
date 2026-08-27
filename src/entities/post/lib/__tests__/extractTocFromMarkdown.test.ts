import { describe, expect, it } from "vitest";

import { extractTocFromMarkdown } from "../extractTocFromMarkdown";

describe("extractTocFromMarkdown", () => {
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

	it("코드 블록 내 heading 제외", () => {
		const md = "```\n## 코드 안 heading\n```\n## 진짜 heading";
		const toc = extractTocFromMarkdown(md);
		expect(toc).toHaveLength(1);
		expect(toc[0]?.text).toBe("진짜 heading");
	});

	it("h2와 h3를 본문 순서대로 뽑고 heading 텍스트를 담는다", () => {
		const md = "## 섹션 1\n### 서브섹션\n## 섹션 2";
		const toc = extractTocFromMarkdown(md);
		expect(toc).toHaveLength(3);
		expect(toc[0]).toMatchObject({ level: 2, text: "섹션 1" });
		expect(toc[1]).toMatchObject({ level: 3, text: "서브섹션" });
		expect(toc[2]).toMatchObject({ level: 2, text: "섹션 2" });
	});
});
