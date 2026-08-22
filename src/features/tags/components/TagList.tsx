import Link from "next/link";

import type { TagCount } from "@/shared/types";
import { cn } from "@/shared/utils/cn";
import { formatLocalizedSlug } from "@/shared/utils/formatLocalizedSlug";

type TagListProps = {
	tags: TagCount[];
	currentTag?: string;
	variant?: "filter" | "navigation";
	className?: string;
};

export function TagList({ tags, currentTag, variant = "navigation", className }: TagListProps) {
	const getHref = (tag: TagCount) => {
		if (variant === "filter") return `/posts?tag=${encodeURIComponent(tag.slug)}`;
		return `/tags/${tag.slug}`;
	};

	const resetHref = variant === "filter" ? "/posts" : "/tags";

	const itemClass = (isActive: boolean) =>
		cn(
			"focus-visible:ring-ring block rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
			isActive ? "bg-muted text-accent" : "text-muted-foreground hover:bg-muted"
		);

	return (
		<div className={cn("space-y-4", className)}>
			<h2 className="text-foreground text-lg font-bold tracking-tight">태그</h2>
			<div className="space-y-1.5">
				<Link href={resetHref} className={itemClass(!currentTag)}>
					전체
				</Link>
				{tags.map((tag) => (
					<Link key={tag.slug} href={getHref(tag)} className={itemClass(currentTag === tag.slug)}>
						{formatLocalizedSlug(tag.tag)} ({tag.count})
					</Link>
				))}
			</div>
		</div>
	);
}
