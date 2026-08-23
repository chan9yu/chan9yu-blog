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
			<header className="mb-12">
				<h1 className="text-foreground tracking-heading mb-6 text-2xl leading-tight font-bold">About</h1>
				<hr className="border-border" />
			</header>

			<div className="mb-12 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
				<div className="bg-muted relative size-32 shrink-0 overflow-hidden rounded-lg">
					<Image
						src={siteMetadata.avatar}
						alt={`${siteMetadata.author} 프로필 사진`}
						fill
						sizes="128px"
						className="object-cover"
						priority
					/>
				</div>
				<div className="flex-1 text-center sm:text-left">
					<h2 className="text-foreground mb-2 text-2xl font-bold">여찬규 (Chan9yu)</h2>
					<p className="text-muted-foreground mb-4 text-lg">Frontend Engineer</p>
					<SocialLinks items={socialItems} className="justify-center sm:justify-start" />
				</div>
			</div>

			<section className="prose" aria-label="소개">
				<CustomMDX source={aboutMdx} />
			</section>
		</article>
	);
}
