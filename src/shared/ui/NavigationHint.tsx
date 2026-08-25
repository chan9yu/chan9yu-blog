"use client";

import { useLinkStatus } from "next/link";

export function NavigationHint() {
	const { pending } = useLinkStatus();

	return <span data-link-hint="" data-pending={pending ? "" : undefined} aria-hidden />;
}
