import Link from "next/link";

import { cn } from "@/shared/utils/cn";
import { formatLocalizedSlug } from "@/shared/utils/formatLocalizedSlug";

type TagChipProps = {
	tag: string;
	slug?: string;
	count?: number;
	size?: "sm" | "md";
	className?: string;
};

export function TagChip({ tag, slug, count, size = "md", className }: TagChipProps) {
	const href = `/tags/${slug ?? tag}`;
	const display = formatLocalizedSlug(tag);
	const label = count !== undefined ? `${display} 태그, ${count}개 글` : `${display} 태그`;

	return (
		<Link
			href={href}
			aria-label={label}
			className={cn(
				"bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex items-center gap-1 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
				size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
				className
			)}
		>
			<span aria-hidden>#</span>
			<span>{display}</span>
			{count !== undefined && (
				<span aria-hidden className="text-xs opacity-70">
					{count}
				</span>
			)}
		</Link>
	);
}
