/** @vitest-environment node */
import * as fs from "node:fs";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { getAboutContent } from "../getAboutContent";

vi.mock("node:fs");

describe("getAboutContent", () => {
	const mockedReadFileSync = vi.mocked(fs.readFileSync);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("파일 누락 시 fs 에러를 그대로 throw한다 (빌드 시점 감지)", () => {
		mockedReadFileSync.mockImplementationOnce(() => {
			throw new Error("ENOENT: no such file");
		});

		expect(() => getAboutContent()).toThrow("ENOENT");
	});
});
