import { ChevronRight } from "lucide-react";
import Link from "next/link";

import type { PostSummary } from "@/entities/post";
import { formatDate } from "@/shared/lib/format/formatDate";

type PopularPostsProps = {
	posts: PostSummary[];
};

export function PopularPosts({ posts }: PopularPostsProps) {
	if (posts.length === 0) {
		return <p className="text-muted-foreground text-sm">아직 포스트가 없습니다.</p>;
	}

	return (
		<ul>
			{posts.map((post) => (
				<li key={post.slug}>
					<Link
						href={`/posts/${post.slug}`}
						className="group focus-visible:ring-ring relative flex min-h-11 flex-col justify-center rounded py-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
					>
						<ChevronRight
							className="text-accent absolute top-1/2 left-0 size-3.5 -translate-y-1/2 opacity-0 transition duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:-translate-x-1.5 motion-safe:group-hover:translate-x-0 motion-safe:group-focus-visible:translate-x-0"
							aria-hidden
						/>
						<div className="flex flex-col gap-1.25 transition-transform duration-200 motion-safe:group-hover:translate-x-5 motion-safe:group-focus-visible:translate-x-5">
							<h3 className="text-card-foreground group-hover:text-accent group-focus-visible:text-accent text-13 line-clamp-2 leading-snug font-semibold transition-colors">
								{post.title}
							</h3>
							<time className="text-muted-foreground text-chip block tabular-nums" dateTime={post.date}>
								{formatDate(post.date)}
							</time>
						</div>
					</Link>
				</li>
			))}
		</ul>
	);
}
