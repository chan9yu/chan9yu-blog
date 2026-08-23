import Link from "next/link";

import type { TagCount } from "@/entities/tag";
import { formatLocalizedSlug } from "@/shared/lib/format/formatLocalizedSlug";

type TrendingTagsProps = {
	tags: TagCount[];
};

export function TrendingTags({ tags }: TrendingTagsProps) {
	if (tags.length === 0) {
		return <p className="text-muted-foreground text-sm">아직 태그가 없습니다.</p>;
	}

	return (
		<ul className="flex flex-wrap gap-2">
			{tags.map((tag) => {
				const display = formatLocalizedSlug(tag.tag);
				return (
					<li key={tag.slug}>
						<Link
							href={`/tags/${tag.slug}`}
							aria-label={`${display} 태그, ${tag.count}개 글`}
							className="bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring focus-visible:bg-accent focus-visible:text-accent-foreground inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
						>
							<span>{display}</span>
							<span className="text-xs opacity-70" aria-hidden>
								{tag.count}
							</span>
						</Link>
					</li>
				);
			})}
		</ul>
	);
}
