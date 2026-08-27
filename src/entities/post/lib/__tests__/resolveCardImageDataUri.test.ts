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
	it("썸네일이 없거나 raster 파일이 없으면 placeholder(svg)로 떨어져 null을 반환한다", () => {
		expect(resolveCardImageDataUri(basePost)).toBeNull();

		const post = { ...basePost, thumbnail: "/posts/no-thumb/images/missing.png" };
		expect(resolveCardImageDataUri(post)).toBeNull();
	});
});
