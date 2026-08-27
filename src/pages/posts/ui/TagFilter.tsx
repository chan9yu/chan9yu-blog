"use client";

import type { TagCount } from "@/entities/tag";
import { cn } from "@/shared/lib/cn";
import { formatLocalizedSlug } from "@/shared/lib/format/formatLocalizedSlug";

import { pushActiveTag } from "../lib/useActiveTag";

const ALL = "전체";

const ITEM_BASE_CLASS =
	"focus-visible:ring-ring block min-h-10 w-full truncate rounded-r-md border-l-2 px-3 py-2.5 text-left text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none";

const ITEM_STATE_CLASS: Record<"active" | "inactive", string> = {
	active: "border-accent bg-accent-subtle text-accent font-bold",
	inactive: "border-transparent text-muted-foreground font-medium hover:bg-bg-subtle hover:text-foreground"
};

type TagFilterProps = {
	tags: TagCount[];
	activeTag: string | null;
};

export function TagFilter({ tags, activeTag }: TagFilterProps) {
	return (
		<div className="max-h-tag-rail sticky top-(--sticky-offset) hidden min-w-0 self-start overflow-y-auto lg:block">
			<h2 className="text-foreground tracking-flat mb-2.5 flex items-center gap-2 text-xs font-bold">
				<span className="bg-accent size-1.25 shrink-0 rounded-full" aria-hidden />
				<span>태그</span>
			</h2>
			<nav aria-label="태그로 좁히기" className="space-y-1">
				<button
					type="button"
					onClick={() => pushActiveTag(null)}
					aria-current={activeTag === null ? "page" : undefined}
					className={cn(ITEM_BASE_CLASS, ITEM_STATE_CLASS[activeTag === null ? "active" : "inactive"])}
				>
					{ALL}
				</button>
				{tags.map((tag) => (
					<button
						key={tag.slug}
						type="button"
						onClick={() => pushActiveTag(tag.tag)}
						aria-current={activeTag === tag.tag ? "page" : undefined}
						className={cn(ITEM_BASE_CLASS, ITEM_STATE_CLASS[activeTag === tag.tag ? "active" : "inactive"])}
					>
						{formatLocalizedSlug(tag.tag)} ({tag.count})
					</button>
				))}
			</nav>
		</div>
	);
}
