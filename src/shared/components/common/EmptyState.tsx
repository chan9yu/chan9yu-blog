import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

type EmptyStateProps = {
	title: string;
	description?: string;
	action?: ReactNode;
	variant?: "default" | "dashed";
	className?: string;
};

export function EmptyState({ title, description, action, variant = "default", className }: EmptyStateProps) {
	return (
		<div
			role="status"
			className={cn(
				"flex flex-col items-center gap-2 rounded-lg px-6 py-12 text-center",
				variant === "dashed" ? "border-border-default border border-dashed" : "border-border-subtle bg-card border",
				className
			)}
		>
			<p className="text-foreground text-base font-semibold text-balance">{title}</p>
			{description && <p className="text-muted-foreground max-w-prose text-sm leading-relaxed">{description}</p>}
			{action && <div className="mt-3">{action}</div>}
		</div>
	);
}
