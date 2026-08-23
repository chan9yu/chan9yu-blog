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
		<ul className="space-y-4">
			{posts.map((post) => (
				<li key={post.slug}>
					<Link
						href={`/posts/${post.slug}`}
						className="group focus-visible:ring-ring block space-y-1 rounded transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
					>
						<h3 className="text-card-foreground group-hover:text-accent group-focus-visible:text-accent line-clamp-2 text-sm leading-tight font-medium transition-colors">
							{post.title}
						</h3>
						<time className="text-muted-foreground block text-xs tabular-nums" dateTime={post.date}>
							{formatDate(post.date)}
						</time>
					</Link>
				</li>
			))}
		</ul>
	);
}
