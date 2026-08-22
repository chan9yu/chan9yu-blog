import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

type SidebarSectionProps = {
	title: string;
	titleId?: string;
	lang?: string;
	children: ReactNode;
	className?: string;
};

export function SidebarSection({ title, titleId, lang, children, className }: SidebarSectionProps) {
	return (
		<section aria-labelledby={titleId} className={cn("space-y-3", className)}>
			<h2 id={titleId} className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
				<span className="bg-accent size-1.5 shrink-0 rounded-full" aria-hidden />
				<span lang={lang}>{title}</span>
			</h2>
			{children}
		</section>
	);
}
