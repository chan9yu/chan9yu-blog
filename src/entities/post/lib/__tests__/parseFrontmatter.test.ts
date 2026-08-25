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
	it("정상 frontmatter 파싱", () => {
		const { frontmatter, content } = parseFrontmatter(VALID_RAW, "test-post");
		expect(frontmatter.title).toBe("테스트 포스트");
		expect(frontmatter.slug).toBe("test-post");
		expect(frontmatter.tags).toEqual(["react", "nextjs"]);
		expect(frontmatter.private).toBe(false);
		expect(frontmatter.thumbnail).toBeNull();
		expect(frontmatter.series).toBeNull();
		expect(frontmatter.seriesOrder).toBeNull();
		expect(content).toContain("본문 내용");
		expect(content).not.toContain("title:");
	});

	it("date ISO 형식 파싱", () => {
		const { frontmatter } = parseFrontmatter(VALID_RAW, "test-post");
		expect(frontmatter.date).toBe("2026-04-15");
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

	it("필수 필드 누락(description) 시 에러", () => {
		const raw = `---
title: "제목만"
slug: no-desc
date: "2026-04-15"
---
`;
		expect(() => parseFrontmatter(raw, "no-desc")).toThrow();
	});

	it("series만 있고 seriesOrder 없으면 에러", () => {
		const raw = `---
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
		expect(() => parseFrontmatter(raw, "series-test")).toThrow();
	});

	it("series·seriesOrder 모두 설정 시 정상", () => {
		const raw = `---
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
		const { frontmatter } = parseFrontmatter(raw, "series-ok");
		expect(frontmatter.series).toBe("my-series");
		expect(frontmatter.seriesOrder).toBe(1);
	});

	it("private: true 파싱", () => {
		const raw = `---
title: "비공개 포스트"
description: "설명"
slug: private-post
date: "2026-04-15"
private: true
tags: []
thumbnail: null
series: null
seriesOrder: null
---
`;
		const { frontmatter } = parseFrontmatter(raw, "private-post");
		expect(frontmatter.private).toBe(true);
	});
});
