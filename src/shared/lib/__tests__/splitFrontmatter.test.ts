import { describe, expect, it } from "vitest";

import { splitFrontmatter } from "../splitFrontmatter";

describe("splitFrontmatter", () => {
	it("frontmatter를 걷어내고 본문만 남긴다", () => {
		const raw = `---
title: "제목"
---
첫 줄
둘째 줄
`;
		const { content } = splitFrontmatter(raw);

		expect(content).toBe("첫 줄\n둘째 줄\n");
	});

	it("frontmatter를 객체로 돌려준다", () => {
		const raw = `---
title: "제목"
tags:
  - react
seriesOrder: 3
private: true
thumbnail: null
---
본문
`;
		const { data } = splitFrontmatter(raw);

		expect(data).toEqual({
			title: "제목",
			tags: ["react"],
			seriesOrder: 3,
			private: true,
			thumbnail: null
		});
	});

	it("frontmatter가 없으면 원문이 그대로 본문이 되고 data는 빈 객체다", () => {
		const raw = "## 제목만 있는 문서\n";
		const { data, content } = splitFrontmatter(raw);

		expect(content).toBe(raw);
		expect(data).toEqual({});
	});

	it("본문에 있는 구분선은 건드리지 않는다", () => {
		const raw = `---
title: "제목"
---
위 문단

---

아래 문단
`;
		const { content } = splitFrontmatter(raw);

		expect(content).toBe("위 문단\n\n---\n\n아래 문단\n");
	});

	it("따옴표 없는 날짜를 Date로 바꾸지 않는다", () => {
		const raw = `---
date: 2026-04-15
---
본문
`;
		const { data } = splitFrontmatter(raw);

		expect(data).toEqual({ date: "2026-04-15" });
	});
});
