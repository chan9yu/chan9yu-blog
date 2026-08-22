import { ChevronRight, Hash } from "lucide-react";
import Link from "next/link";

import { formatLocalizedSlug } from "@/shared/utils/formatLocalizedSlug";

type TagCardProps = {
	tag: string;
	slug: string;
	count: number;
};

export function TagCard({ tag, slug, count }: TagCardProps) {
	return (
		<Link
			href={`/tags/${slug}`}
			className="group bg-card border-border-subtle hover:border-accent/40 hover:bg-bg-subtle focus-visible:ring-ring flex min-h-11 items-center gap-3 rounded-lg border p-4 transition-[border-color,background-color] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
		>
			<Hash className="text-accent size-4 shrink-0" aria-hidden />
			<span className="min-w-0 flex-1 truncate">
				<span className="text-card-foreground group-hover:text-accent block truncate text-sm font-semibold transition-colors">
					{formatLocalizedSlug(tag)}
				</span>
				<span className="text-muted-foreground text-chip block tabular-nums">{count}개의 글</span>
			</span>
			<ChevronRight
				className="text-muted-foreground size-4 shrink-0 transition-transform motion-safe:group-hover:translate-x-1"
				aria-hidden
			/>
		</Link>
	);
}
