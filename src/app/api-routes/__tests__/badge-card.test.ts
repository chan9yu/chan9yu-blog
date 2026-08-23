import { describe, expect, it } from "vitest";

import { renderBadgeCard as GET } from "../badge-card";

function call(index: string, theme: string) {
	return GET(new Request(`https://chan9yu.dev/badge/recent/${index}/${theme}`), {
		params: Promise.resolve({ index, theme })
	});
}

describe("GET /badge/recent/[index]/[theme]", () => {
	it("유효하지 않은 theme은 404", async () => {
		expect((await call("0", "blue")).status).toBe(404);
	});

	it("범위 밖 index는 404", async () => {
		expect((await call("999", "dark")).status).toBe(404);
	});
});
