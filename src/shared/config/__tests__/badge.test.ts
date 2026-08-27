import { describe, expect, it } from "vitest";

import { BADGE_RECENT_COUNT, parseBadgeIndex } from "../badge";

describe("parseBadgeIndex", () => {
	it("0 이상 BADGE_RECENT_COUNT 미만 정수 문자열만 숫자로 바꾸고 나머지는 null", () => {
		expect(parseBadgeIndex("0")).toBe(0);
		expect(parseBadgeIndex(String(BADGE_RECENT_COUNT - 1))).toBe(BADGE_RECENT_COUNT - 1);

		expect(parseBadgeIndex(String(BADGE_RECENT_COUNT))).toBeNull();
		expect(parseBadgeIndex("-1")).toBeNull();
		expect(parseBadgeIndex("1.5")).toBeNull();
		expect(parseBadgeIndex("abc")).toBeNull();
		expect(parseBadgeIndex("")).toBeNull();
	});
});
