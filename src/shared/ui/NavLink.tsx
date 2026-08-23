"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

const NAV_LINK_BASE_CLASS =
	"focus-visible:ring-ring/50 inline-flex min-h-11 items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none hover:bg-muted";

const NAV_LINK_STATE_CLASS: Record<"active" | "inactive", string> = {
	active: "bg-muted text-accent",
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
		</Link>
	);
}
