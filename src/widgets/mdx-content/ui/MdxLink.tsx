import NextLink from "next/link";
import type { ComponentProps } from "react";

type MdxLinkProps = ComponentProps<"a">;

export function MdxLink({ href, children, ...rest }: MdxLinkProps) {
	if (!href) return <span {...rest}>{children}</span>;

	const isExternal = /^https?:\/\//i.test(href);
	if (isExternal) {
		return (
			<a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
				{children}
				<span className="sr-only"> (새 창에서 열림)</span>
			</a>
		);
	}

	return (
		<NextLink href={href} {...rest}>
			{children}
		</NextLink>
	);
}
