const HANGUL_PATTERN = /[ㄱ-ㆎ가-힣]/;

export function formatLocalizedSlug(slug: string) {
	if (!HANGUL_PATTERN.test(slug)) return slug;
	return slug.replaceAll("-", " ");
}
