import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Children, type ComponentProps, isValidElement } from "react";
import rehypeSlug from "rehype-slug";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

import { getShikiHighlighter } from "@/shared/libs/shiki";

import { Callout } from "./Callout";
import { MdxHeading } from "./MdxHeading";
import { MdxImage } from "./MdxImage";
import { MdxLink } from "./MdxLink";
import { MdxPre } from "./MdxPre";
import { MdxTable } from "./MdxTable";

type CustomMDXProps = {
	source: string;
};

type HeadingSlotProps = ComponentProps<"h2"> & { id?: string };

function MdxH1(props: HeadingSlotProps) {
	return <MdxHeading level={2} {...props} />;
}

function MdxH2(props: HeadingSlotProps) {
	return <MdxHeading level={3} {...props} />;
}

function MdxH3(props: HeadingSlotProps) {
	return <MdxHeading level={4} {...props} />;
}

function MdxP({ children, ...props }: ComponentProps<"p">) {
	const hasBlockChild = Children.toArray(children).some((child) => isValidElement(child) && child.type === MdxImage);
	if (hasBlockChild) {
		return <>{children}</>;
	}
	return <p {...props}>{children}</p>;
}

const MDX_COMPONENTS = {
	h1: MdxH1,
	h2: MdxH2,
	h3: MdxH3,
	p: MdxP,
	pre: MdxPre,
	img: MdxImage,
	a: MdxLink,
	table: MdxTable,
	Callout
} as const;

export async function CustomMDX({ source }: CustomMDXProps) {
	const highlighter = await getShikiHighlighter();

	return (
		<MDXRemote
			source={source}
			components={MDX_COMPONENTS}
			options={{
				mdxOptions: {
					remarkPlugins: [remarkGfm, remarkBreaks],
					rehypePlugins: [
						rehypeSlug,
						() =>
							rehypeShikiFromHighlighter(highlighter, {
								themes: { light: "github-light", dark: "github-dark" },
								defaultColor: false
							})
					]
				}
			}}
		/>
	);
}
