import Image from "next/image";

import { siteMetadata } from "@/shared/config/site";
import { socialItems } from "@/shared/ui/socialItems";
import { SocialLinks } from "@/shared/ui/SocialLinks";
import { CustomMDX } from "@/widgets/mdx-content";

import { getAboutContent } from "../api/getAboutContent";

export function AboutProfile() {
	const aboutMdx = getAboutContent();

	return (
		<article>
			<h1 className="text-foreground tracking-hero border-border-subtle mb-6 border-b pb-5 text-4xl leading-tight font-extrabold">
				About
			</h1>

			<div className="mb-14 flex flex-wrap items-center gap-6">
				<div className="bg-bg-subtle border-border-subtle relative size-28 shrink-0 overflow-hidden rounded-lg border">
					<Image
						src={siteMetadata.avatar}
						alt={`${siteMetadata.author} 프로필 사진`}
						fill
						sizes="112px"
						className="object-cover"
						priority
					/>
				</div>
				<div className="min-w-0">
					<h2 className="text-foreground mb-1.5 text-xl font-bold tracking-tight">여찬규 (Chan9yu)</h2>
					<p className="text-muted-foreground text-14 mb-3.5">Frontend Engineer</p>
					<SocialLinks items={socialItems} size="compact" />
				</div>
			</div>

			<section className="prose prose-about" aria-label="소개">
				<CustomMDX source={aboutMdx} />
			</section>
		</article>
	);
}
