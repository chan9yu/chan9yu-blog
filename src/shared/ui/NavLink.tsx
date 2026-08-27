"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";
import { NavigationHint } from "@/shared/ui/NavigationHint";

const NAV_LINK_BASE_CLASS =
	"focus-visible:ring-ring hover:bg-bg-subtle rounded-control relative inline-flex min-h-11 items-center px-3 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";

const NAV_LINK_STATE_CLASS: Record<"active" | "inactive", string> = {
	active: "bg-bg-subtle text-accent underline decoration-2 underline-offset-4",
	inactive: "text-muted-foreground"
};

type NavLinkProps = ComponentProps<typeof Link> & {
	exact?: boolean;
};

function resolveIsActive(pathname: string | null, target: string | null | undefined, exact: boolean) {
	if (pathname === null) return false;
	if (target === undefined || target === null) return false;
	if (exact || target === "/") return pathname === target;
	return pathname === target || pathname.startsWith(`${target}/`);
}

export function NavLink({ href, exact = false, className, children, ...rest }: NavLinkProps) {
	const pathname = usePathname();
	const target = typeof href === "string" ? href : href.pathname;
	const isActive = resolveIsActive(pathname, target, exact);

	return (
		<Link
			href={href}
			aria-current={isActive ? "page" : undefined}
			className={cn(NAV_LINK_BASE_CLASS, NAV_LINK_STATE_CLASS[isActive ? "active" : "inactive"], className)}
			{...rest}
		>
			{children}
			<NavigationHint />
		</Link>
	);
}
