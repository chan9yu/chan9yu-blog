import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

type SocialLinkItem = {
	label: string;
	href: string;
	icon: ReactNode;
};

type SocialLinksProps = {
	items: SocialLinkItem[];
	className?: string;
};

export function SocialLinks({ items, className }: SocialLinksProps) {
	return (
		<ul className={cn("flex flex-wrap gap-3", className)}>
			{items.map((item) => {
				const isExternal = /^https?:\/\//i.test(item.href);

				return (
					<li key={item.href}>
						<a
							href={item.href}
							target={isExternal ? "_blank" : undefined}
							rel={isExternal ? "noopener noreferrer" : undefined}
							className="bg-card text-foreground border-border-subtle focus-visible:ring-ring group hover:bg-bg-subtle hover:border-accent/40 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-[background-color,border-color] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
						>
							<span className="inline-flex size-4 items-center justify-center" aria-hidden>
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
