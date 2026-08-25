import type { PropsWithChildren } from "react";

export function HomeSidebar({ children }: PropsWithChildren) {
	return (
		<aside aria-label="추천 블록" className="hidden min-w-0 lg:block">
			<div className="[&>section+section]:border-border-subtle sticky top-(--sticky-offset) space-y-6 [&>section+section]:border-t [&>section+section]:pt-6">
				{children}
			</div>
		</aside>
	);
}
