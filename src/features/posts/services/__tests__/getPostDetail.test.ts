/** @vitest-environment node */
import * as fs from "node:fs";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { getPostDetail } from "../getPostDetail";

vi.mock("node:fs");

const makeMdx = (slug: string, overrides: Record<string, string | boolean | null> = {}) => {
	const defaults: Record<string, string | boolean | null> = {
		title: "상세 포스트 제목",
		description: "이것은 상세 테스트 포스트의 설명입니다.",
		slug,
		date: "2026-04-01",
		private: false,
		tags: '["test"]',
		thumbnail: null,
		series: null,
		seriesOrder: null
	};
	const fm = { ...defaults, ...overrides };
	const lines = Object.entries(fm).map(([k, v]) => {
		if (v === null) return `${k}: null`;
		if (typeof v === "boolean") return `${k}: ${v}`;
		if (k === "tags") return `${k}: ${v}`;
		return `${k}: "${v}"`;
	});
	return `---\n${lines.join("\n")}\n---\n\n## 섹션 1\n\n내용입니다.\n\n### 서브섹션 1-1\n\n세부 내용.`;
};

describe("getPostDetail", () => {
	const mockedReadFileSync = vi.mocked(fs.readFileSync);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("유효한 slug → PostDetail 반환", () => {
		mockedReadFileSync.mockReturnValue(makeMdx("my-post") as unknown as ReturnType<typeof fs.readFileSync>);

		const detail = getPostDetail("my-post");
		expect(detail).not.toBeNull();
		expect(detail?.slug).toBe("my-post");
		expect(detail?.title).toBe("상세 포스트 제목");
		expect(typeof detail?.readingTimeMinutes).toBe("number");
		expect(detail?.readingTimeMinutes).toBeGreaterThanOrEqual(1);
	});

	it("contentMdx에 frontmatter를 제외한 본문이 담긴다", () => {
		mockedReadFileSync.mockReturnValue(makeMdx("body-post") as unknown as ReturnType<typeof fs.readFileSync>);

		const detail = getPostDetail("body-post");
		expect(detail?.contentMdx).toContain("내용입니다.");
		expect(detail?.contentMdx).not.toContain("---");
	});

	it("toc는 본문의 h2·h3 heading을 순서대로 추출한다", () => {
		mockedReadFileSync.mockReturnValue(makeMdx("toc-post") as unknown as ReturnType<typeof fs.readFileSync>);

		const detail = getPostDetail("toc-post");
		expect(detail?.toc).toHaveLength(2);
		expect(detail?.toc[0]?.level).toBe(2);
		expect(detail?.toc[0]?.text).toBe("섹션 1");
		expect(detail?.toc[1]?.level).toBe(3);
		expect(detail?.toc[1]?.text).toBe("서브섹션 1-1");
	});

	it("존재하지 않는 파일 → null 반환", () => {
		mockedReadFileSync.mockImplementation(() => {
			throw new Error("ENOENT: no such file or directory");
		});

		const detail = getPostDetail("non-existent");
		expect(detail).toBeNull();
	});

	it("private 포스트도 반환한다 (private 필터링은 호출자 책임)", () => {
		mockedReadFileSync.mockReturnValue(
			makeMdx("private-post", { private: true }) as unknown as ReturnType<typeof fs.readFileSync>
		);

		const detail = getPostDetail("private-post");
		expect(detail).not.toBeNull();
		expect(detail?.private).toBe(true);
	});

	it("frontmatter 검증 실패 → null 반환", () => {
		mockedReadFileSync.mockReturnValue(
			"---\ntitle: incomplete\nslug: bad-post\ndate: 2026-04-01\n---\n" as unknown as ReturnType<typeof fs.readFileSync>
		);

		const detail = getPostDetail("bad-post");
		expect(detail).toBeNull();
	});
});
