import { describe, expect, it } from "vitest";

import type { PostSummary } from "../../model/post";
import { resolveCardImageDataUri } from "../resolveCardImageDataUri";

const basePost: PostSummary = {
	slug: "no-thumb",
	title: "썸네일 없는 글",
	description: "desc",
	date: "2026-01-01",
	private: false,
	tags: [],
	thumbnail: null,
	series: null,
	seriesOrder: null,
	readingTimeMinutes: 1
};

describe("resolveCardImageDataUri", () => {
	it("썸네일이 null이면 null을 반환한다(resolveThumbnailSrc가 즉시 null)", () => {
		expect(resolveCardImageDataUri(basePost)).toBeNull();
	});

	it("존재하지 않는 raster 경로는 placeholder(svg) 폴백 → null", () => {
		const post = { ...basePost, thumbnail: "/posts/no-thumb/images/missing.png" };
		expect(resolveCardImageDataUri(post)).toBeNull();
	});
});
