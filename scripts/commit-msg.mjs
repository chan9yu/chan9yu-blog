import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const templatePath = join(__dirname, "commit-template.txt");
const targetPath = process.argv[2];

const existingMessage = readFileSync(targetPath, "utf-8");
const template = readFileSync(templatePath, "utf-8");

const hasExistingMessage = existingMessage.split("\n").some((line) => line.trim() && !line.startsWith("#"));

if (!hasExistingMessage) {
	writeFileSync(targetPath, template);
}
