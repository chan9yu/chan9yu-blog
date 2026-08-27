/** @vitest-environment node */
import { describe, expect, it } from "vitest";

const pageRoutes: [string, () => Promise<unknown>][] = [
	["/", () => import("../../../app/page")],
	["/about", () => import("../../../app/about/page")],
	["/posts", () => import("../../../app/posts/page")],
	["/posts/[slug]", () => import("../../../app/posts/[slug]/page")],
	["/tags", () => import("../../../app/tags/page")],
	["/tags/[tag]", () => import("../../../app/tags/[tag]/page")],
	["/series", () => import("../../../app/series/page")],
	["/series/[slug]", () => import("../../../app/series/[slug]/page")]
];

const dynamicRoutes: [string, () => Promise<unknown>][] = [
	["/posts/[slug]", () => import("../../../app/posts/[slug]/page")],
	["/tags/[tag]", () => import("../../../app/tags/[tag]/page")],
	["/series/[slug]", () => import("../../../app/series/[slug]/page")]
];

describe("app 라우트 metadata 재노출 사슬", () => {
	for (const [route, loadRoute] of pageRoutes) {
		it(`${route} 라우트 파일은 metadata와 페이지 컴포넌트를 다시 내보낸다`, async () => {
			const mod = (await loadRoute()) as Record<string, unknown>;

			expect(mod.metadata ?? mod.generateMetadata).toBeDefined();
			expect(typeof mod.default).toBe("function");
		});
	}

	it("루트 layout은 metadata와 viewport를 다시 내보낸다", async () => {
		const mod = (await import("../../../app/layout")) as Record<string, unknown>;

		expect(mod.metadata).toBeDefined();
		expect(mod.viewport).toBeDefined();
		expect(typeof mod.default).toBe("function");
	});
});

describe("동적 라우트의 dynamicParams", () => {
	for (const [route, loadRoute] of dynamicRoutes) {
		it(`${route}는 dynamicParams를 false로 닫는다`, async () => {
			const mod = (await loadRoute()) as Record<string, unknown>;

			expect(mod.dynamicParams).toBe(false);
		});
	}
});
