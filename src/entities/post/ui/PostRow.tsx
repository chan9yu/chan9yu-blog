import Link from "next/link";

import { formatDate } from "@/shared/lib/format/formatDate";

import type { PostSummary } from "../model/post";
import { PostMetaRow } from "./PostMetaRow";
import { Thumbnail } from "./Thumbnail";

type PostRowProps = {
	post: PostSummary;
	priority?: boolean;
};

export function PostRow({ post, priority = false }: PostRowProps) {
	return (
		<Link
			href={`/posts/${post.slug}`}
			className="group bg-card border-border-subtle grid-post-row hover:border-accent/40 focus-visible:ring-ring grid items-start gap-4 rounded-lg border p-5 transition-[border-color] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none lg:gap-5"
		>
			<Thumbnail src={post.thumbnail} sizes="(max-width: 1023px) 100vw, 200px" priority={priority} rounded />

			<div className="min-w-0">
				<h3 className="text-card-foreground group-hover:text-accent tracking-flat line-clamp-2 text-base leading-normal font-bold text-pretty transition-colors">
					{post.title}
				</h3>
				<time className="text-muted-foreground text-chip mt-2 block tabular-nums" dateTime={post.date}>
					{formatDate(post.date)}
				</time>
				<p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-loose text-pretty">{post.description}</p>
				<PostMetaRow tags={post.tags} readingTimeMinutes={post.readingTimeMinutes} className="mt-3" />
			</div>
		</Link>
	);
}
