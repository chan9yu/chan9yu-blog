export function slugify(text: string) {
	return text
		.toLowerCase()
		.replace(/\s/g, "-")
		.replace(/[^a-z0-9가-힣-]/g, "")
		.replace(/^-+|-+$/g, "");
}
