"use client";

import { Menu, X } from "lucide-react";
import type { ReactNode } from "react";
import { useId, useState } from "react";

import { Drawer } from "@/shared/components/ui/Drawer";
import { type NavItem, siteNav } from "@/shared/config/site";

import { NavLink } from "../common/NavLink";

type MobileMenuProps = {
	navItems?: NavItem[];
	socialLinksSlot?: ReactNode;
	triggerLabel?: string;
};

export function MobileMenu({ navItems = siteNav, socialLinksSlot, triggerLabel = "메뉴 열기" }: MobileMenuProps) {
	const [open, setOpen] = useState(false);
	const titleId = useId();

	const close = () => setOpen(false);

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				aria-label={triggerLabel}
				aria-expanded={open}
				className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 inline-flex size-11 cursor-pointer items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
			>
				<Menu className="size-5" aria-hidden />
			</button>

			<Drawer
				open={open}
				onClose={close}
				side="right"
				aria-labelledby={titleId}
				panelClassName="flex w-72 max-w-[85vw] flex-col sm:max-w-sm"
			>
				<div className="border-border-subtle flex items-center justify-between border-b px-4 py-4">
					<h2 id={titleId} className="text-lg font-bold">
						메뉴
					</h2>
					<button
						type="button"
						onClick={close}
						aria-label="메뉴 닫기"
						className="text-muted-foreground hover:bg-bg-subtle hover:text-foreground focus-visible:ring-ring inline-flex size-11 cursor-pointer items-center justify-center rounded-lg transition-[background-color,color] focus-visible:ring-2 focus-visible:outline-none"
					>
						<X className="size-5" aria-hidden />
					</button>
				</div>

				<nav className="mt-2 flex flex-col gap-1 px-4" aria-label="모바일 메뉴">
					{navItems.map((item) => (
						<NavLink key={item.href} href={item.href} onClick={close} className="hover:bg-muted px-3 py-2 font-medium">
							{item.label}
						</NavLink>
					))}
				</nav>

				{socialLinksSlot && <div className="border-border-subtle mt-auto border-t p-4">{socialLinksSlot}</div>}
			</Drawer>
		</>
	);
}
