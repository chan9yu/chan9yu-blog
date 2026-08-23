"use client";

import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { TagCount } from "@/entities/tag";
import { cn } from "@/shared/lib/cn";
import { formatLocalizedSlug } from "@/shared/lib/format/formatLocalizedSlug";

const ALL = "전체";

const ITEM_BASE_CLASS =
	"focus-visible:ring-ring block min-h-11 truncate rounded-md px-3 py-2.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none";

type TagFilterProps = {
	tags: TagCount[];
};

export function TagFilter({ tags }: TagFilterProps) {
	const [open, setOpen] = useState(false);

	const links = (
		<>
			<Link
				href="/tags"
				className={cn(ITEM_BASE_CLASS, "bg-accent-subtle text-accent font-medium")}
				onClick={() => setOpen(false)}
			>
				{ALL}
			</Link>
			{tags.map((tag) => (
				<Link
					key={tag.slug}
					href={`/tags/${tag.slug}`}
					className={cn(ITEM_BASE_CLASS, "text-muted-foreground hover:bg-bg-subtle")}
					onClick={() => setOpen(false)}
				>
					{formatLocalizedSlug(tag.tag)} ({tag.count})
				</Link>
			))}
		</>
	);

	return (
		<>
			<aside className="lg:max-h-sidebar sticky top-24 hidden w-56 shrink-0 overflow-y-auto lg:block">
				<nav aria-label="태그로 좁히기" className="space-y-1">
					{links}
				</nav>
			</aside>

			<div className="mb-6 space-y-2 lg:hidden">
				<button
					type="button"
					aria-expanded={open}
					onClick={() => setOpen((prev) => !prev)}
					className="focus-visible:ring-ring border-border-subtle text-muted-foreground bg-card hover:bg-bg-subtle flex h-11 w-full items-center gap-2 rounded-md border px-3 text-sm font-medium transition-[background-color,border-color,color] focus-visible:ring-2 focus-visible:outline-none"
				>
					<SlidersHorizontal className="size-4 shrink-0" aria-hidden />
					<span className="truncate">{open ? "태그 닫기" : "태그로 좁히기"}</span>
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
		</>
	);
}
