import NextLink from "next/link";
import type { ComponentProps } from "react";

import { siteHostname } from "@/shared/config/site";

type MdxLinkProps = ComponentProps<"a">;

const ABSOLUTE_URL_PATTERN = /^https?:\/\//i;
const SELF_HOSTNAMES = [siteHostname, `www.${siteHostname}`];

function resolveInternalHref(href: string) {
	if (!ABSOLUTE_URL_PATTERN.test(href)) {
		return href;
	}

	const url = new URL(href);
	if (!SELF_HOSTNAMES.includes(url.hostname)) {
		return null;
	}

	return `${url.pathname}${url.search}${url.hash}`;
}

export function MdxLink({ href, children, ...rest }: MdxLinkProps) {
	if (!href) {
		return <span {...rest}>{children}</span>;
	}

	const internalHref = resolveInternalHref(href);

	if (internalHref === null) {
		return (
			<a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
				{children}
				<span className="sr-only"> (새 창에서 열림)</span>
			</a>
		);
	}

	return (
		<NextLink href={internalHref} {...rest}>
			{children}
		</NextLink>
	);
}
