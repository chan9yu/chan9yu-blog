"use client";

import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { TagCount } from "@/shared/types";
import { cn } from "@/shared/utils/cn";
import { formatLocalizedSlug } from "@/shared/utils/formatLocalizedSlug";

const ALL = "전체";

type TagFilterSheetProps = {
	tags: TagCount[];
	activeSlug?: string;
	variant: "rail" | "sheet";
	className?: string;
};

function itemClass(isActive: boolean) {
	return cn(
		"focus-visible:ring-ring block min-h-11 truncate rounded-md px-3 py-2.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
		isActive ? "bg-accent-subtle text-accent font-medium" : "text-muted-foreground hover:bg-bg-subtle"
	);
}

export function TagFilterSheet({ tags, activeSlug, variant, className }: TagFilterSheetProps) {
	const [open, setOpen] = useState(false);
	const activeTag = tags.find((tag) => tag.slug === activeSlug);
	const activeLabel = activeTag ? formatLocalizedSlug(activeTag.tag) : ALL;
	const isFiltered = activeSlug !== undefined;

	const links = (
		<>
			<Link href="/tags" className={itemClass(!isFiltered)} onClick={() => setOpen(false)}>
				{ALL}
			</Link>
			{tags.map((tag) => (
				<Link
					key={tag.slug}
					href={`/tags/${tag.slug}`}
					className={itemClass(tag.slug === activeSlug)}
					onClick={() => setOpen(false)}
				>
					{formatLocalizedSlug(tag.tag)} ({tag.count})
				</Link>
			))}
		</>
	);

	if (variant === "rail") {
		return (
			<nav aria-label="태그로 좁히기" className={cn("space-y-1", className)}>
				{links}
			</nav>
		);
	}

	return (
		<div className={cn("space-y-2", className)}>
			<button
				type="button"
				aria-expanded={open}
				onClick={() => setOpen((prev) => !prev)}
				className={cn(
					"focus-visible:ring-ring flex h-11 w-full items-center gap-2 rounded-md border px-3 text-sm font-medium transition-[background-color,border-color,color] focus-visible:ring-2 focus-visible:outline-none",
					isFiltered
						? "border-accent text-accent bg-accent-subtle"
						: "border-border-subtle text-muted-foreground bg-card hover:bg-bg-subtle"
				)}
			>
				<SlidersHorizontal className="size-4 shrink-0" aria-hidden />
				<span className="truncate">
					{open ? "태그 닫기" : "태그로 좁히기"}
					{isFiltered && ` · ${activeLabel}`}
				</span>
			</button>

			{open && (
				<nav
					aria-label="태그로 좁히기"
					className="border-border-subtle bg-card max-h-mobile-sheet space-y-1 overflow-y-auto rounded-md border p-2"
				>
					{links}
				</nav>
			)}
		</div>
	);
}
