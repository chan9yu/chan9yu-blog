import { AlertCircle, CheckCircle, Info, TriangleAlert } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

type CalloutVariant = "info" | "tip" | "warning" | "danger";

type CalloutProps = ComponentProps<"aside"> & {
	variant?: CalloutVariant;
	title?: string;
};

const ICON_MAP = {
	info: Info,
	tip: CheckCircle,
	warning: TriangleAlert,
	danger: AlertCircle
} as const;

const VARIANT_STYLES: Record<CalloutVariant, string> = {
	info: "border-accent/30 bg-accent/5 text-foreground",
	tip: "border-success/30 bg-success/5 text-foreground",
	warning: "border-warning/40 bg-warning/5 text-foreground",
	danger: "border-destructive/40 bg-destructive/5 text-foreground"
};

export function Callout({ variant = "info", title, children, className, ...rest }: CalloutProps) {
	const Icon = ICON_MAP[variant];
	return (
		<aside
			role="note"
			className={cn("my-6 flex gap-3 rounded-md border p-4", VARIANT_STYLES[variant], className)}
			{...rest}
		>
			<Icon className="mt-0.5 size-5 shrink-0" aria-hidden />
			<div className="min-w-0 flex-1 space-y-1">
				{title && <p className="text-sm font-semibold">{title}</p>}
				<div className="text-sm leading-relaxed">{children}</div>
			</div>
		</aside>
	);
}
