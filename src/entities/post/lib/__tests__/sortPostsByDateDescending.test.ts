import { describe, expect, it } from "vitest";

import type { PostSummary } from "../../model/post";
import { sortPostsByDateDescending } from "../sortPostsByDateDescending";

const makePost = (slug: string, date: string): PostSummary => ({
	title: "테스트 포스트",
	description: "테스트용 포스트 설명입니다.",
	slug,
	date,
	private: false,
	tags: [],
	thumbnail: null,
	series: null,
	seriesOrder: null,
	readingTimeMinutes: 1
});

describe("sortPostsByDateDescending", () => {
	it("날짜 내림차순으로 정렬한다", () => {
		const posts = [makePost("old", "2026-01-01"), makePost("new", "2026-04-01"), makePost("mid", "2026-02-15")];
		const sorted = sortPostsByDateDescending(posts);
		expect(sorted[0]?.slug).toBe("new");
		expect(sorted[1]?.slug).toBe("mid");
		expect(sorted[2]?.slug).toBe("old");
	});

	it("원본 배열을 변경하지 않는다 (불변)", () => {
		const posts = [makePost("a", "2026-02-01"), makePost("b", "2026-01-01")];
		const originalFirst = posts[0]?.slug;
		sortPostsByDateDescending(posts);
		expect(posts[0]?.slug).toBe(originalFirst);
	});
});
