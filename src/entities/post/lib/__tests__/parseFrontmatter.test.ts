import { describe, expect, it } from "vitest";

import { parseFrontmatter } from "../parseFrontmatter";

const VALID_RAW = `---
title: "테스트 포스트"
description: "테스트 설명입니다. 충분한 길이의 설명을 입력합니다."
slug: test-post
date: "2026-04-15"
private: false
tags:
  - react
  - nextjs
thumbnail: null
series: null
seriesOrder: null
---
본문 내용
`;

describe("parseFrontmatter", () => {
	it("series와 seriesOrder가 둘 다 없는 글은 refine을 통과한다", () => {
		const { frontmatter } = parseFrontmatter(VALID_RAW, "test-post");
		expect(frontmatter.series).toBeNull();
		expect(frontmatter.seriesOrder).toBeNull();
	});

	it("-- → --- 보정 (두 대시 구분자)", () => {
		const raw = `--
title: "보정 테스트"
description: "설명"
slug: fix-test
date: "2026-04-15"
private: false
tags: []
thumbnail: null
series: null
seriesOrder: null
--
본문
`;
		const { frontmatter, content } = parseFrontmatter(raw, "fix-test");
		expect(frontmatter.slug).toBe("fix-test");
		expect(content).not.toContain("title:");
	});

	it("slug/디렉토리명 불일치 시 에러", () => {
		expect(() => parseFrontmatter(VALID_RAW, "different-dir")).toThrow(/slug/);
	});

	it("series와 seriesOrder는 함께 있을 때만 통과한다", () => {
		const seriesOnly = `---
title: "시리즈 불일치"
description: "설명"
slug: series-test
date: "2026-04-15"
private: false
tags: []
thumbnail: null
series: "my-series"
seriesOrder: null
---
`;
		expect(() => parseFrontmatter(seriesOnly, "series-test")).toThrow();

		const bothSet = `---
title: "시리즈 포스트"
description: "설명"
slug: series-ok
date: "2026-04-15"
private: false
tags: []
thumbnail: null
series: "my-series"
seriesOrder: 1
---
`;
		const { frontmatter } = parseFrontmatter(bothSet, "series-ok");
		expect(frontmatter.series).toBe("my-series");
		expect(frontmatter.seriesOrder).toBe(1);
	});
});
