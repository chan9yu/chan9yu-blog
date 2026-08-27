import { Calendar, Clock } from "lucide-react";
import type { ReactNode } from "react";

import { formatDate } from "@/shared/lib/format/formatDate";
import { TagChip } from "@/shared/ui/TagChip";

import type { PostSummary } from "../model/post";

type PostMetaHeaderProps = {
	post: PostSummary;
	shareSlot?: ReactNode;
	viewCounterSlot?: ReactNode;
};

export function PostMetaHeader({ post, shareSlot, viewCounterSlot }: PostMetaHeaderProps) {
	return (
		<header className="mb-10 sm:mb-14">
			<h1 className="text-foreground tracking-title mb-4.5 text-3xl leading-tight font-bold text-balance break-keep">
				{post.title}
			</h1>
			<p className="text-muted-foreground text-subtitle leading-prose mb-4.5 text-pretty break-keep">
				{post.description}
			</p>

			<div className="text-muted-foreground flex flex-wrap items-center gap-x-3.5 gap-y-2 text-xs">
				<time dateTime={post.date} className="flex items-center gap-1.5 tabular-nums">
					<Calendar className="size-3.25" aria-hidden />
					발행일 {formatDate(post.date)}
				</time>
				<span className="flex items-center gap-1.5 tabular-nums">
					<Clock className="size-3.25" aria-hidden />
					읽는 시간 {post.readingTimeMinutes}분
				</span>
				{viewCounterSlot}
			</div>

			<div className="border-border-subtle mt-4.5 flex flex-col items-start gap-3 border-b pb-7 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
				{post.tags.length > 0 && (
					<ul className="flex flex-wrap gap-1.5" aria-label="태그">
						{post.tags.map((tag) => (
							<li key={tag}>
								<TagChip tag={tag} size="md" />
							</li>
						))}
					</ul>
				)}
				{shareSlot}
			</div>
		</header>
	);
}
