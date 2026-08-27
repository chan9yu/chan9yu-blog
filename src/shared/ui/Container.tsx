import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

type ContainerProps = ComponentProps<"div"> & {
	size?: "default" | "prose";
};

export function Container({ size = "default", className, ...rest }: ContainerProps) {
	return (
		<div
			className={cn(
				"w420:px-7 w900:px-10 mx-auto w-full px-5",
				size === "default" && "max-w-content",
				size === "prose" && "max-w-prose",
				className
			)}
			{...rest}
		/>
	);
}
