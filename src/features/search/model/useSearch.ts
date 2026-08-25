"use client";

import Fuse, { type IFuseOptions } from "fuse.js";
import { useEffect, useMemo, useRef, useState } from "react";

import type { PostSummary } from "@/entities/post";

import type { SearchResult } from "../model/SearchResult";

const SEARCH_THRESHOLD = 0.4;
const DEFAULT_LIMIT = 10;
const DEBOUNCE_MS = 200;

const fuseOptions: IFuseOptions<PostSummary> = {
	keys: [
		{ name: "title", weight: 0.5 },
		{ name: "description", weight: 0.3 },
		{ name: "tags", weight: 0.2 }
	],
	includeMatches: true,
	ignoreLocation: true,
	minMatchCharLength: 2,
	threshold: SEARCH_THRESHOLD
};

type UseSearchOptions = {
	posts: PostSummary[];
	limit?: number;
};

type UseSearchReturn = {
	query: string;
	debouncedQuery: string;
	setQuery: (next: string) => void;
	results: SearchResult[];
};

export function useSearch({ posts, limit = DEFAULT_LIMIT }: UseSearchOptions): UseSearchReturn {
	const [query, setQueryState] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");

	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const fuse = useMemo(() => new Fuse(posts, fuseOptions), [posts]);

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
		}, DEBOUNCE_MS);
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

		return fuse.search(trimmed, { limit }).map(({ item, matches }) => ({
			post: item,
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
