"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import type { SearchResult } from "../model/SearchResult";

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
			className="hover:bg-bg-subtle focus-visible:bg-bg-subtle focus-visible:ring-ring border-border-subtle grid-content-aside grid min-h-14 items-center gap-4 border-b px-4 py-3 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
		>
			<span className="min-w-0">
				<span className="text-foreground text-14 line-clamp-2 block leading-normal font-semibold">
					{renderHighlighted(result.post.title, titleIndices)}
				</span>
				<span className="text-muted-foreground text-chip mt-1 line-clamp-1 block">
					{renderHighlighted(result.post.description, descriptionIndices)}
				</span>
			</span>
			<span className="bg-accent-subtle text-accent text-11 inline-flex h-6 shrink-0 items-center rounded-sm px-2 whitespace-nowrap">
				포스트
			</span>
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
			<mark key={effectiveStart} className="bg-accent/20 text-foreground rounded-sm px-0.5">
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
