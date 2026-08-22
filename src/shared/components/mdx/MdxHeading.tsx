import { Link } from "lucide-react";
import type { ComponentProps } from "react";
import { createElement } from "react";

import { cn } from "@/shared/utils/cn";

type HeadingProps = ComponentProps<"h2"> & {
	level: 2 | 3 | 4;
};

export function MdxHeading({ level, id, children, className, ...rest }: HeadingProps) {
	return createElement(
		`h${level}`,
		{
			id,
			className: cn("group relative", className),
			...rest
		},
		id ? (
			<a
				key="anchor"
				href={`#${id}`}
				aria-label={`${typeof children === "string" ? children : (id?.replace(/-/g, " ") ?? "섹션")} 앵커 링크`}
				className="text-muted-foreground hover:text-accent focus-visible:text-accent absolute top-1/2 -left-6 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
			>
				<Link className="size-4" aria-hidden />
			</a>
		) : null,
		children
	);
}
