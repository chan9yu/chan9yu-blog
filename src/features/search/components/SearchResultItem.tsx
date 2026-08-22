"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import type { SearchResult } from "../types";

type SearchResultItemProps = {
	result: SearchResult;
	onSelect: () => void;
};

export function SearchResultItem({ result, onSelect }: SearchResultItemProps) {
	const titleIndices = findMatchIndices(result, "title");
	const descriptionIndices = findMatchIndices(result, "description");

	return (
		<Link
			href={`/posts/${result.post.slug}`}
			onClick={onSelect}
			className="hover:bg-muted focus-visible:bg-muted focus-visible:ring-ring block rounded-md px-3 py-2 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
		>
			<p className="text-foreground line-clamp-1 text-sm font-medium">
				{renderHighlighted(result.post.title, titleIndices)}
			</p>
			<p className="text-muted-foreground line-clamp-1 text-xs">
				{renderHighlighted(result.post.description, descriptionIndices)}
			</p>
		</Link>
	);
}

function findMatchIndices(result: SearchResult, key: "title" | "description") {
	const match = result.matches?.find((m) => m.key === key);
	return match?.indices ?? [];
}

function renderHighlighted(source: string, indices: ReadonlyArray<readonly [number, number]>) {
	if (indices.length === 0) return source;

	const sorted = [...indices].sort((a, b) => a[0] - b[0]);
	const chunks: ReactNode[] = [];
	let cursor = 0;

	sorted.forEach(([start, end]) => {
		const sliceEnd = end + 1;
		if (sliceEnd <= cursor) return;

		const effectiveStart = Math.max(start, cursor);
		if (effectiveStart > cursor) {
			chunks.push(source.slice(cursor, effectiveStart));
		}
		chunks.push(
			<mark key={effectiveStart} className="bg-primary/20 text-foreground rounded-sm px-0.5">
				{source.slice(effectiveStart, sliceEnd)}
			</mark>
		);
		cursor = sliceEnd;
	});

	if (cursor < source.length) {
		chunks.push(source.slice(cursor));
	}

	return chunks;
}
