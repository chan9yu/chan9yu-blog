import { describe, expect, it } from "vitest";

import { splitFrontmatter } from "../splitFrontmatter";

describe("splitFrontmatter", () => {
	it("frontmatter를 객체로 돌려주고 따옴표 없는 날짜를 Date로 바꾸지 않는다", () => {
		const raw = `---
title: "제목"
tags:
  - react
seriesOrder: 3
private: true
thumbnail: null
date: 2026-04-15
---
본문
`;
		const { data } = splitFrontmatter(raw);

		expect(data).toEqual({
			title: "제목",
			tags: ["react"],
			seriesOrder: 3,
			private: true,
			thumbnail: null,
			date: "2026-04-15"
		});
	});

	it("본문의 구분선을 건드리지 않고 frontmatter가 없으면 원문을 그대로 낸다", () => {
		const withFrontmatter = `---
title: "제목"
---
위 문단

---

아래 문단
`;
		const withoutFrontmatter = "## 제목만 있는 문서\n";

		expect(splitFrontmatter(withFrontmatter).content).toBe("위 문단\n\n---\n\n아래 문단\n");
		expect(splitFrontmatter(withoutFrontmatter).content).toBe(withoutFrontmatter);
		expect(splitFrontmatter(withoutFrontmatter).data).toEqual({});
	});
});
