const CHARS_PER_MINUTE = 500;

export function calculateReadingTime(content: string) {
	const stripped = content
		.replace(/```[\s\S]*?```/g, "")
		.replace(/\$\$[\s\S]*?\$\$/g, "")
		.replace(/\$[^$\n]+\$/g, "")
		.replace(/!\[.*?\]\(.*?\)/g, "")
		.trim();

	const charCount = stripped.length;

	return Math.max(1, Math.ceil(charCount / CHARS_PER_MINUTE));
}
