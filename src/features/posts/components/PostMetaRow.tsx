import { Clock } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { formatLocalizedSlug } from "@/shared/utils/formatLocalizedSlug";

const MAX_TAGS = 2;

type PostMetaRowProps = {
	tags: string[];
	readingTimeMinutes: number;
	className?: string;
};

export function PostMetaRow({ tags, readingTimeMinutes, className }: PostMetaRowProps) {
	const visible = tags.slice(0, MAX_TAGS);
	const hidden = tags.length - visible.length;

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<div className="flex min-w-0 flex-wrap items-center gap-1.5">
				{visible.map((tag) => (
					<span
						key={tag}
						className="border-border-subtle text-muted-foreground max-w-tag-sm text-chip inline-flex h-6 items-center gap-0.5 truncate rounded-md border px-2"
					>
						<span aria-hidden>#</span>
						<span className="truncate">{formatLocalizedSlug(tag)}</span>
					</span>
				))}
				{hidden > 0 && (
					<span className="text-muted-foreground text-chip inline-flex h-6 items-center tabular-nums">+{hidden}</span>
				)}
			</div>
			<span className="text-muted-foreground text-chip ml-auto inline-flex shrink-0 items-center gap-1 whitespace-nowrap tabular-nums">
				<Clock className="size-3" aria-hidden />
				읽는 시간 {readingTimeMinutes}분
			</span>
		</div>
	);
}
