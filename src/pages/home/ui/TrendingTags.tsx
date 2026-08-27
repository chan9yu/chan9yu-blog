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
		<ul className="flex flex-wrap gap-1.5">
			{tags.map((tag) => {
				const display = formatLocalizedSlug(tag.tag);
				return (
					<li key={tag.slug}>
						<Link
							href={`/tags/${encodeURIComponent(tag.slug)}`}
							aria-label={`${display} 태그, ${tag.count}개 글`}
							className="bg-bg-subtle border-border-subtle text-muted-foreground hover:border-accent hover:text-accent focus-visible:ring-ring focus-visible:border-accent focus-visible:text-accent text-chip inline-flex h-7 items-center gap-1.5 rounded-sm border px-2.25 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
						>
							<span className="max-w-tag truncate">{display}</span>
							<span className="text-text-tertiary shrink-0" aria-hidden>
								{tag.count}
							</span>
						</Link>
					</li>
				);
			})}
		</ul>
	);
}
