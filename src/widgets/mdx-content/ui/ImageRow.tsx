import type { ReactNode } from "react";

type ImageRowProps = {
	children: ReactNode;
};

export function ImageRow({ children }: ImageRowProps) {
	return <div className="my-6 grid gap-3 sm:auto-cols-fr sm:grid-flow-col [&>figure]:my-0">{children}</div>;
}
