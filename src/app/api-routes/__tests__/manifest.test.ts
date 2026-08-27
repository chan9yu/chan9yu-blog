/** @vitest-environment node */

import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { manifest } from "../manifest";

const PUBLIC_DIR = join(process.cwd(), "public");

describe("manifest", () => {
	it("모든 아이콘 경로가 public에 실제로 있다", () => {
		const icons = manifest().icons ?? [];

		expect(icons.length).toBeGreaterThan(0);

		for (const icon of icons) {
			expect(existsSync(join(PUBLIC_DIR, icon.src)), icon.src).toBe(true);
		}
	});
});
