import type { ReactNode } from "react";

import { SidebarSection } from "./SidebarSection";

type HomeSidebarSection = {
	title: string;
	titleId: string;
	content: ReactNode;
};

type HomeSidebarProps = {
	sections: HomeSidebarSection[];
};

export function HomeSidebar({ sections }: HomeSidebarProps) {
	return (
		<>
			<aside aria-label="추천 블록" className="hidden w-64 shrink-0 lg:block">
				<div className="[&>section+section]:border-border-subtle sticky top-24 space-y-6 [&>section+section]:border-t [&>section+section]:pt-6">
					{sections.map((section) => (
						<SidebarSection key={section.titleId} title={section.title} titleId={`${section.titleId}-wide`}>
							{section.content}
						</SidebarSection>
					))}
				</div>
			</aside>

			<aside aria-label="추천 블록" className="space-y-3 lg:hidden">
				{sections.map((section) => (
					<SidebarSection key={section.titleId} title={section.title} titleId={`${section.titleId}-narrow`} collapsible>
						{section.content}
					</SidebarSection>
				))}
			</aside>
		</>
	);
}
