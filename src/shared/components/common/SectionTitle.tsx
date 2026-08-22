import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

type SectionTitleProps = {
	children: ReactNode;
	id?: string;
	action?: ReactNode;
	size?: "sm" | "md";
	className?: string;
};

export function SectionTitle({ children, id, action, size = "md", className }: SectionTitleProps) {
	return (
		<div className={cn("flex items-center justify-between gap-4", className)}>
			<h2
				id={id}
				className={cn(
					"text-foreground tracking-heading flex items-center gap-3 font-bold",
					size === "sm" ? "text-[17px]" : "text-xl"
				)}
			>
				<span
					className={cn("bg-accent w-accent-bar shrink-0 rounded-[2px]", size === "sm" ? "h-[18px]" : "h-5")}
					aria-hidden
				/>
				<span>{children}</span>
			</h2>
			{action}
		</div>
	);
}
