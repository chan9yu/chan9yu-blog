const BRACKET_PREFIX = /^\[[^\]]*#\d+\]\s*/;

function escapeRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function stripSeriesPrefix(title: string, seriesName?: string) {
	const withoutBracket = title.replace(BRACKET_PREFIX, "");
	if (withoutBracket !== title || !seriesName) {
		return withoutBracket;
	}

	const loose = escapeRegExp(seriesName).replace(/\\?\s+/g, "\\s*");
	const namePrefix = new RegExp(`^${loose}\\s*[,.\\-:]?\\s*`);

	const stripped = withoutBracket.replace(namePrefix, "");
	return stripped.length > 0 ? stripped : withoutBracket;
}
