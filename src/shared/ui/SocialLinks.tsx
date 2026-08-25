import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

type SocialLinkItem = {
	label: string;
	href: string;
	icon: ReactNode;
};

type SocialLinksSize = "default" | "compact";

type SocialLinksProps = {
	items: SocialLinkItem[];
	size?: SocialLinksSize;
	className?: string;
};

const LIST_CLASS: Record<SocialLinksSize, string> = {
	default: "gap-2",
	compact: "gap-1.5"
};

const LINK_CLASS: Record<SocialLinksSize, string> = {
	default: "bg-card rounded-control h-11 gap-2 px-4 text-sm",
	compact: "bg-bg-subtle min-h-10 gap-1.75 rounded-md px-3.5 text-13"
};

export function SocialLinks({ items, size = "default", className }: SocialLinksProps) {
	return (
		<ul className={cn("flex flex-wrap", LIST_CLASS[size], className)}>
			{items.map((item) => {
				const isExternal = /^https?:\/\//i.test(item.href);

				return (
					<li key={item.href}>
						<a
							href={item.href}
							target={isExternal ? "_blank" : undefined}
							rel={isExternal ? "noopener noreferrer" : undefined}
							className={cn(
								"text-foreground border-border-subtle focus-visible:ring-ring group hover:bg-bg-subtle hover:border-accent/40 inline-flex items-center border font-semibold transition duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-105",
								LINK_CLASS[size]
							)}
						>
							<span
								className="inline-flex size-4 items-center justify-center transition-transform duration-200 motion-safe:group-hover:rotate-12"
								aria-hidden
							>
								{item.icon}
							</span>
							{item.label}
						</a>
					</li>
				);
			})}
		</ul>
	);
}
