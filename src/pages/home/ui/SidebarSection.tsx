import type { ReactNode } from "react";

type SidebarSectionProps = {
	title: string;
	titleId: string;
	children: ReactNode;
};

export function SidebarSection({ title, titleId, children }: SidebarSectionProps) {
	return (
		<section aria-labelledby={titleId} className="space-y-2.5">
			<h2 id={titleId} className="text-foreground tracking-flat flex items-center gap-2 text-xs font-bold">
				<span className="bg-accent size-1.25 shrink-0 rounded-full" aria-hidden />
				<span lang="en">{title}</span>
			</h2>
			{children}
		</section>
	);
}
