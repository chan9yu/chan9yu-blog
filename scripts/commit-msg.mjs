import { readFileSync, writeFileSync } from "node:fs";

const targetPath = process.argv[2];

const existingMessage = readFileSync(targetPath, "utf-8");
const template = readFileSync(new URL("./commit-template.txt", import.meta.url), "utf-8");

const hasExistingMessage = existingMessage.split("\n").some((line) => line.trim() && !line.startsWith("#"));

if (!hasExistingMessage) {
	writeFileSync(targetPath, template);
}
