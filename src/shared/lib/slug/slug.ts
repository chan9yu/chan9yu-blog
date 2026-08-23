const SLUG_PATTERN = /^[a-z0-9-]+$/;
const SLUG_MAX_LENGTH = 120;

export function validateSlug(value: unknown) {
	if (typeof value !== "string") return null;
	if (value.length === 0 || value.length > SLUG_MAX_LENGTH) return null;
	if (!SLUG_PATTERN.test(value)) return null;
	return value;
}

export function normalizeSlug(raw: string) {
	try {
		return validateSlug(decodeURIComponent(raw));
	} catch {
		return null;
	}
}
