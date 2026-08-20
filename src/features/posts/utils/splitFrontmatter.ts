import { VFile } from "vfile";
import { matter } from "vfile-matter";

// strip 옵션이 파일 값에서 frontmatter 블록을 잘라내므로 String(file)에는 본문만 남는다.
// frontmatter가 없으면 data는 빈 객체가 된다.
export function splitFrontmatter(raw: string) {
	const file = new VFile(raw);
	matter(file, { strip: true });

	return {
		data: file.data.matter,
		content: String(file)
	};
}
