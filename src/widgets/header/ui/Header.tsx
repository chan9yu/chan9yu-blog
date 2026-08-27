import Link from "next/link";
import type { ReactNode } from "react";

import { siteNav } from "@/shared/config/site";
import { Container } from "@/shared/ui/Container";
import { NavLink } from "@/shared/ui/NavLink";

type HeaderProps = {
	searchSlot?: ReactNode;
	themeSlot?: ReactNode;
	mobileMenuSlot?: ReactNode;
};

export function Header({ searchSlot, themeSlot, mobileMenuSlot }: HeaderProps) {
	return (
		<header className="bg-background/88 header-scroll-border z-sticky short:static backdrop-blur-header sticky top-0 print:static">
			<Container>
				<nav
					className="short:min-h-11 short:py-0 flex min-h-16 items-center justify-between gap-2 py-2"
					aria-label="주요 메뉴"
				>
					<Link
						href="/"
						aria-label="chan9yu 홈"
						className="text-foreground text-16 tracking-flat flex min-h-11 items-center font-bold transition-colors"
					>
						{"<chan9yu />"}
					</Link>

					<div className="flex items-center gap-1 md:gap-2">
						<div className="mr-1 hidden items-center gap-1 md:flex">
							{siteNav.map((item) => (
								<NavLink key={item.href} href={item.href}>
									{item.label}
								</NavLink>
							))}
						</div>
						{searchSlot}
						{themeSlot}
						<div className="md:hidden">{mobileMenuSlot}</div>
					</div>
				</nav>
			</Container>
		</header>
	);
}
