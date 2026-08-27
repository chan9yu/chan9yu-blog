import { ChevronRight, Hash } from "lucide-react";
import Link from "next/link";

import { formatLocalizedSlug } from "@/shared/lib/format/formatLocalizedSlug";

type TagCardProps = {
	tag: string;
	slug: string;
	count: number;
};

export function TagCard({ tag, slug, count }: TagCardProps) {
	return (
		<Link
			href={`/tags/${encodeURIComponent(slug)}`}
			className="group bg-card border-border-subtle hover:border-accent/40 hover:bg-bg-subtle focus-visible:ring-ring flex min-h-19 flex-col gap-1.5 rounded-lg border p-4 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
		>
			<span className="flex items-center gap-2">
				<Hash className="text-accent size-3.5 shrink-0" aria-hidden />
				<span className="text-card-foreground group-hover:text-accent min-w-0 truncate text-sm font-semibold transition-colors">
					{formatLocalizedSlug(tag)}
				</span>
				<ChevronRight
					className="text-muted-foreground ml-auto size-3.5 shrink-0 transition-transform motion-safe:group-hover:translate-x-1"
					aria-hidden
				/>
			</span>
			<span className="text-muted-foreground text-chip tabular-nums">{count}개의 글</span>
		</Link>
	);
}
