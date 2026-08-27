import { Clock } from "lucide-react";

import { cn } from "@/shared/lib/cn";
import { TagChip } from "@/shared/ui/TagChip";

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
			<div className="flex min-w-0 items-center gap-1.5">
				{visible.map((tag) => (
					<TagChip key={tag} tag={tag} size="sm" href={null} className="min-w-0" />
				))}
				{hidden > 0 && (
					<span className="text-muted-foreground text-chip inline-flex h-6 shrink-0 items-center tabular-nums">
						<span className="sr-only">태그 {hidden}개 더</span>
						<span aria-hidden>+{hidden}</span>
					</span>
				)}
			</div>
			<span className="text-muted-foreground text-chip ml-auto inline-flex shrink-0 items-center gap-1 whitespace-nowrap tabular-nums">
				<Clock className="size-3" aria-hidden />
				<span className="sr-only">읽는 시간 {readingTimeMinutes}분</span>
				<span aria-hidden>{readingTimeMinutes}분</span>
			</span>
		</div>
	);
}
