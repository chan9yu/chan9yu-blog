"use client";

import Fuse, { type IFuseOptions } from "fuse.js";
import { useEffect, useMemo, useRef, useState } from "react";

import type { PostSummary } from "@/shared/types";

import type { SearchResult } from "../types";

const DEFAULT_THRESHOLD = 0.4;
const DEFAULT_LIMIT = 10;
const DEFAULT_DEBOUNCE_MS = 200;

const fuseBaseOptions: IFuseOptions<PostSummary> = {
	keys: [
		{ name: "title", weight: 0.5 },
		{ name: "description", weight: 0.3 },
		{ name: "tags", weight: 0.2 }
	],
	includeScore: true,
	includeMatches: true,
	ignoreLocation: true,
	minMatchCharLength: 2
};

type UseSearchOptions = {
	posts: PostSummary[];
	threshold?: number;
	limit?: number;
	debounceMs?: number;
};

type UseSearchReturn = {
	query: string;
	debouncedQuery: string;
	setQuery: (next: string) => void;
	results: SearchResult[];
};

export function useSearch({
	posts,
	threshold = DEFAULT_THRESHOLD,
	limit = DEFAULT_LIMIT,
	debounceMs = DEFAULT_DEBOUNCE_MS
}: UseSearchOptions): UseSearchReturn {
	const [query, setQueryState] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");

	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const fuse = useMemo(() => new Fuse(posts, { ...fuseBaseOptions, threshold }), [posts, threshold]);

	const setQuery = (next: string) => {
		setQueryState(next);
		if (timerRef.current !== null) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}

		if (next === "") {
			setDebouncedQuery("");
			return;
		}

		timerRef.current = setTimeout(() => {
			setDebouncedQuery(next);
			timerRef.current = null;
		}, debounceMs);
	};

	useEffect(() => {
		return () => {
			if (timerRef.current !== null) {
				clearTimeout(timerRef.current);
				timerRef.current = null;
			}
		};
	}, []);

	const results = useMemo<SearchResult[]>(() => {
		const trimmed = debouncedQuery.trim();
		if (trimmed === "") return [];

		return fuse.search(trimmed, { limit }).map(({ item, score, matches }) => ({
			post: item,
			score: score ?? 1,
			matches
		}));
	}, [debouncedQuery, fuse, limit]);

	return {
		query,
		debouncedQuery,
		setQuery,
		results
	};
}
