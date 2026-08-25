import type { Metadata } from "next";
import Link from "next/link";

import { getPublicPosts } from "@/entities/post/index.server";
import { formatDate } from "@/shared/lib/format/formatDate";
import { NOT_FOUND_METADATA } from "@/shared/seo";
import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";

export const notFoundMetadata: Metadata = { ...NOT_FOUND_METADATA, title: "페이지를 찾을 수 없습니다" };

const RECENT_POST_LIMIT = 5;

export function NotFoundPage() {
	const recentPosts = getPublicPosts().slice(0, RECENT_POST_LIMIT);

	return (
		<Container>
			<div className="flex flex-col items-start pt-10 pb-6">
				<span className="bg-logo-mark mb-7 block size-11 opacity-55" aria-hidden />
				<p className="text-text-tertiary text-13 mb-3 font-mono tracking-widest">404 NOT FOUND</p>
				<h1 className="text-foreground tracking-hero mb-4 text-3xl leading-tight font-extrabold text-pretty">
					찾으시는 페이지가 없습니다
				</h1>
				<p className="text-muted-foreground leading-prose mb-8 max-w-prose text-base text-pretty">
					주소가 바뀌었거나 삭제된 글일 수 있습니다. 아래에서 다시 찾아보세요.
				</p>
				<div className="mb-11 flex flex-wrap gap-2">
					<Button href="/" variant="accent">
						홈으로
					</Button>
					<Button href="/posts">전체 포스트</Button>
				</div>

				{recentPosts.length > 0 && (
					<section aria-labelledby="not-found-recent" className="w-full">
						<h2
							id="not-found-recent"
							className="text-foreground tracking-flat mb-2.5 flex items-center gap-2 text-xs font-bold"
						>
							<span className="bg-accent size-1.25 shrink-0 rounded-full" aria-hidden />
							최근 글
						</h2>
						<ul>
							{recentPosts.map((post) => (
								<li key={post.slug}>
									<Link
										href={`/posts/${post.slug}`}
										className="border-border-subtle hover:text-accent focus-visible:ring-ring focus-visible:text-accent flex min-h-11 items-center justify-between gap-4 border-b py-3 transition-colors focus-visible:ring-2 focus-visible:outline-none"
									>
										<span className="line-clamp-2 text-sm leading-relaxed font-semibold text-pretty">{post.title}</span>
										<time className="text-text-tertiary text-chip shrink-0 tabular-nums" dateTime={post.date}>
											{formatDate(post.date)}
										</time>
									</Link>
								</li>
							))}
						</ul>
					</section>
				)}
			</div>
		</Container>
	);
}
