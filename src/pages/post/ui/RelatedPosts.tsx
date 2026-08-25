import type { RelatedPost } from "@/entities/post";
import { PostCard } from "@/entities/post";
import { SectionTitle } from "@/shared/ui/SectionTitle";

type RelatedPostsProps = {
	posts: RelatedPost[];
};

export function RelatedPosts({ posts }: RelatedPostsProps) {
	if (posts.length === 0) return null;

	return (
		<section aria-labelledby="related-posts-title" className="mt-12 sm:mt-16">
			<SectionTitle id="related-posts-title" size="sm" className="mb-4">
				이런 글도 읽어보세요
			</SectionTitle>
			<div className="w480:grid-cols-2 grid grid-cols-1 gap-3 lg:grid-cols-3">
				{posts.slice(0, 3).map((post) => (
					<PostCard key={post.slug} post={post} />
				))}
			</div>
		</section>
	);
}
