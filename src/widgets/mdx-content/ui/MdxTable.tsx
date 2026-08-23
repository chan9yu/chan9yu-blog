import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

type MdxTableProps = ComponentProps<"table">;

export function MdxTable({ className, ...rest }: MdxTableProps) {
	return (
		<div className="border-border-subtle my-6 overflow-x-auto rounded-md border">
			<table className={cn("min-w-full text-left text-sm", className)} {...rest} />
		</div>
	);
}
