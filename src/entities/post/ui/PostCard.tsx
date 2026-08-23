import Link from "next/link";

import { formatDate } from "@/shared/lib/format/formatDate";

import type { PostSummary } from "../model/post";
import { PostMetaRow } from "./PostMetaRow";
import { Thumbnail } from "./Thumbnail";

const IMAGE_SIZES = "(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw";

type PostCardProps = {
	post: PostSummary;
	priority?: boolean;
};

export function PostCard({ post, priority = false }: PostCardProps) {
	return (
		<Link
			href={`/posts/${post.slug}`}
			className="group bg-card border-border-subtle hover:border-accent/40 focus-visible:ring-ring flex h-full flex-col overflow-hidden rounded-lg border transition-[border-color] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
		>
			<Thumbnail src={post.thumbnail} sizes={IMAGE_SIZES} priority={priority} />

			<div className="flex flex-1 flex-col gap-2 p-5">
				<h3 className="text-card-foreground group-hover:text-accent tracking-flat line-clamp-2 text-base leading-normal font-bold text-pretty transition-colors">
					{post.title}
				</h3>
				<time className="text-muted-foreground text-chip block tabular-nums" dateTime={post.date}>
					{formatDate(post.date)}
				</time>
				<p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed text-pretty">{post.description}</p>
				<PostMetaRow tags={post.tags} readingTimeMinutes={post.readingTimeMinutes} className="mt-auto pt-3" />
			</div>
		</Link>
	);
}
