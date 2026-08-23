import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

type SidebarSectionProps = {
	title: string;
	titleId: string;
	collapsible?: boolean;
	children: ReactNode;
};

export function SidebarSection({ title, titleId, collapsible = false, children }: SidebarSectionProps) {
	const heading = (
		<h2 id={titleId} className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
			<span className="bg-accent size-1.5 shrink-0 rounded-full" aria-hidden />
			<span lang="en">{title}</span>
		</h2>
	);

	if (collapsible) {
		return (
			<details className="group border-border-subtle rounded-lg border">
				<summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-4 py-3 [&::-webkit-details-marker]:hidden">
					{heading}
					<ChevronDown
						className="text-muted-foreground size-4 shrink-0 transition-transform group-open:rotate-180"
						aria-hidden
					/>
				</summary>
				<div className="px-4 pb-4">{children}</div>
			</details>
		);
	}

	return (
		<section aria-labelledby={titleId} className="space-y-3">
			{heading}
			{children}
		</section>
	);
}
