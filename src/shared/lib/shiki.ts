import { createHighlighter } from "shiki";

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

export async function getShikiHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: ["github-light", "github-dark"],
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
