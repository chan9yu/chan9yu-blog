import Link from "next/link";

import { cn } from "@/shared/lib/cn";
import { formatLocalizedSlug } from "@/shared/lib/format/formatLocalizedSlug";

type TagChipSize = "sm" | "md" | "lg";

const CHIP_BASE_CLASS =
	"text-chip inline-flex items-center gap-1.5 overflow-hidden rounded-sm border leading-none whitespace-nowrap transition-colors";

const CHIP_SIZE_CLASS: Record<TagChipSize, string> = {
	sm: "h-6 px-[9px] max-w-tag-sm",
	md: "h-[26px] px-[9px] max-w-tag-md",
	lg: "h-7 px-2.5 max-w-tag"
};

const CHIP_STATE_CLASS: Record<"active" | "inactive", string> = {
	active: "bg-accent-subtle border-accent text-accent",
	inactive: "bg-bg-subtle border-border-subtle text-muted-foreground"
};

const CHIP_INTERACTIVE_CLASS =
	"focus-visible:ring-ring hover:border-accent hover:text-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";

type TagChipProps = {
	tag: string;
	slug?: string;
	count?: number;
	size?: TagChipSize;
	active?: boolean;
	href?: string | null;
	className?: string;
};

export function TagChip({ tag, slug, count, size = "md", active = false, href, className }: TagChipProps) {
	const display = formatLocalizedSlug(tag);
	const classes = cn(
		CHIP_BASE_CLASS,
		CHIP_SIZE_CLASS[size],
		CHIP_STATE_CLASS[active ? "active" : "inactive"],
		href !== null && CHIP_INTERACTIVE_CLASS,
		className
	);
	const body = (
		<>
			<span className="truncate">
				<span aria-hidden>#</span>
				{display}
			</span>
			{count !== undefined && <span className="text-muted-foreground shrink-0 tabular-nums">{count}</span>}
		</>
	);

	if (href === null) {
		return <span className={classes}>{body}</span>;
	}

	const label = count !== undefined ? `${display} 태그, ${count}개 글` : `${display} 태그`;

	return (
		<Link href={href ?? `/tags/${slug ?? tag}`} aria-label={label} className={classes}>
			{body}
		</Link>
	);
}
