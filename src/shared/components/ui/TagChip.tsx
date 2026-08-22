import { cva } from "class-variance-authority";
import Link from "next/link";

import { cn } from "@/shared/utils/cn";
import { formatLocalizedSlug } from "@/shared/utils/formatLocalizedSlug";

const chip = cva(
	"text-chip inline-flex items-center gap-1.5 overflow-hidden rounded-sm border leading-none whitespace-nowrap transition-colors",
	{
		variants: {
			size: {
				sm: "h-6 px-[9px]",
				md: "h-[26px] px-[9px]",
				lg: "h-7 px-2.5"
			},
			active: {
				true: "bg-accent-subtle border-accent text-accent",
				false: "bg-bg-subtle border-border-subtle text-muted-foreground"
			},
			interactive: {
				true: "focus-visible:ring-ring hover:border-accent hover:text-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
				false: ""
			}
		},
		defaultVariants: {
			size: "md",
			active: false,
			interactive: false
		}
	}
);

const MAX_WIDTH: Record<"sm" | "md" | "lg", string> = {
	sm: "max-w-tag-sm",
	md: "max-w-tag-md",
	lg: "max-w-tag"
};

type TagChipProps = {
	tag: string;
	slug?: string;
	count?: number;
	size?: "sm" | "md" | "lg";
	active?: boolean;
	href?: string | null;
	className?: string;
};

export function TagChip({ tag, slug, count, size = "md", active = false, href, className }: TagChipProps) {
	const display = formatLocalizedSlug(tag);
	const classes = cn(chip({ size, active, interactive: href !== null }), MAX_WIDTH[size], className);
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
