import { VFile } from "vfile";
import { matter } from "vfile-matter";

export function splitFrontmatter(raw: string) {
	const file = new VFile(raw);
	matter(file, { strip: true });

	return {
		data: file.data.matter,
		content: String(file)
	};
}
