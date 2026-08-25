import { createHighlighter } from "shiki";

export const SHIKI_THEMES = {
	light: "github-light-high-contrast",
	dark: "github-dark-high-contrast"
} as const;

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

export async function getShikiHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: Object.values(SHIKI_THEMES),
			langs: [
				"javascript",
				"typescript",
				"jsx",
				"tsx",
				"bash",
				"sh",
				"shell",
				"json",
				"yaml",
				"html",
				"css",
				"markdown",
				"python",
				"sql",
				"text"
			]
		}).catch((error: unknown) => {
			highlighterPromise = null;
			throw error;
		});
	}

	return highlighterPromise;
}
