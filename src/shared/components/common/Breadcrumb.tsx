import Link from "next/link";

import { cn } from "@/shared/utils/cn";

type BreadcrumbItem = {
	label: string;
	href?: string;
};

type BreadcrumbProps = {
	items: BreadcrumbItem[];
	className?: string;
};

export function Breadcrumb({ items, className }: BreadcrumbProps) {
	if (items.length < 2) {
		return null;
	}

	return (
		<nav aria-label="위치" className={cn("min-w-0", className)}>
			<ol className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
				{items.map((item, index) => {
					const isLast = index === items.length - 1;

					return (
						<li key={item.href ?? item.label} className="flex min-w-0 items-center gap-2">
							{isLast || !item.href ? (
								<span aria-current="page" className="text-foreground truncate">
									{item.label}
								</span>
							) : (
								<Link
									href={item.href}
									className="hover:text-accent focus-visible:ring-ring truncate rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
								>
									{item.label}
								</Link>
							)}
							{!isLast && (
								<span aria-hidden className="shrink-0">
									/
								</span>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
