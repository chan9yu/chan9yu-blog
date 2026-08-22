"use client";

import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import type { TagCount } from "@/shared/types";

import { TagFilterSheet } from "./TagFilterSheet";

const WIDE = "(min-width: 1024px)";

type TagFilterProps = {
	tags: TagCount[];
	activeSlug?: string;
};

export function TagFilter({ tags, activeSlug }: TagFilterProps) {
	const isWide = useMediaQuery(WIDE);

	if (isWide) {
		return (
			<aside className="lg:max-h-sidebar sticky top-24 w-56 shrink-0 overflow-y-auto">
				<TagFilterSheet tags={tags} activeSlug={activeSlug} variant="rail" />
			</aside>
		);
	}

	return <TagFilterSheet tags={tags} activeSlug={activeSlug} variant="sheet" className="mb-6" />;
}
