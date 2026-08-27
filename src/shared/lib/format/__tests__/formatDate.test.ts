import { describe, expect, it } from "vitest";

import { formatDate } from "../formatDate";

describe("formatDate", () => {
	it("UTC 15시 이후에 발행한 글도 한국 날짜로 낸다 (서버가 UTC라 목록과 상세가 하루 어긋나던 회귀)", () => {
		expect(formatDate("2025-10-11T21:44:00.000Z")).toBe("2025.10.12");
		expect(formatDate("2024-08-04T15:14:00.318Z")).toBe("2024.08.05");
	});

	it("UTC 15시 이전은 날짜가 그대로다", () => {
		expect(formatDate("2026-06-18T05:00:00.000Z")).toBe("2026.06.18");
	});
});
