import { describe, expect, it } from "vitest";

import { getPublicPosts } from "@/entities/post/index.server";
import { getSiteUrl } from "@/shared/config/site";

import { redirectToRecentPost as GET } from "../badge-redirect";

function call(index: string) {
	return GET(new Request("https://chan9yu.dev/badge/recent/" + index), {
		params: Promise.resolve({ index })
	});
}

describe("GET /badge/recent/[index]", () => {
	it("유효한 index는 N번째 최신 글로 302 리다이렉트한다", async () => {
		const [newest] = getPublicPosts();
		if (!newest) {
			throw new Error("테스트를 위해 최소 1개의 공개 포스트 필요");
		}
		const res = await call("0");
		expect(res.status).toBe(302);
		expect(res.headers.get("Location")).toBe(`${getSiteUrl()}/posts/${newest.slug}`);
	});

	it("범위 밖·비정수 index는 404", async () => {
		expect((await call("999")).status).toBe(404);
		expect((await call("abc")).status).toBe(404);
	});
});
