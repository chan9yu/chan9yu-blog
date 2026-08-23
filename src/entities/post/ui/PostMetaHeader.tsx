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
		<header className="mb-10 space-y-5 sm:mb-14 sm:space-y-7">
			<div className="space-y-4 sm:space-y-5">
				<h1 className="text-foreground tracking-title text-3xl leading-tight font-bold text-balance break-keep">
					{post.title}
				</h1>
				<p className="text-muted-foreground text-base leading-relaxed text-pretty break-keep sm:text-lg">
					{post.description}
				</p>
			</div>

			<div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
				<time dateTime={post.date} className="flex items-center gap-1.5 tabular-nums">
					<Calendar className="size-4" aria-hidden />
					{formatDate(post.date)}
				</time>
				<span className="flex items-center gap-1.5 tabular-nums">
					<Clock className="size-4" aria-hidden />
					읽는 시간 {post.readingTimeMinutes}분
				</span>
				{viewCounterSlot}
			</div>

			<div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
				{post.tags.length > 0 && (
					<ul className="flex flex-wrap gap-2" aria-label="태그">
						{post.tags.map((tag) => (
							<li key={tag}>
								<TagChip tag={tag} size="md" />
							</li>
						))}
					</ul>
				)}
				{shareSlot}
			</div>

			<hr className="border-border" />
		</header>
	);
}
