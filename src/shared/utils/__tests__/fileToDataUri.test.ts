import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { fileToDataUri } from "../fileToDataUri";

const PNG_1X1 = Buffer.from(
	"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
	"base64"
);

describe("fileToDataUri", () => {
	it("png 파일을 data URI 문자열로 변환한다", () => {
		const dir = mkdtempSync(join(tmpdir(), "badge-"));
		const file = join(dir, "thumb.png");
		writeFileSync(file, PNG_1X1);

		const result = fileToDataUri(file);

		expect(result.startsWith("data:image/png;base64,")).toBe(true);
		expect(result.length).toBeGreaterThan("data:image/png;base64,".length);
	});

	it("지원하지 않는 확장자는 throw 한다", () => {
		const dir = mkdtempSync(join(tmpdir(), "badge-"));
		const file = join(dir, "note.txt");
		writeFileSync(file, "hello");

		expect(() => fileToDataUri(file)).toThrow(/지원하지 않는 확장자/);
	});
});
