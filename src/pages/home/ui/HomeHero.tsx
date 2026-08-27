import { socialItems } from "@/shared/ui/socialItems";
import { SocialLinks } from "@/shared/ui/SocialLinks";

export function HomeHero() {
	return (
		<section aria-labelledby="home-hero-title">
			<p className="text-muted-foreground -tracking-heading text-13 mb-2.5 font-semibold">프론트엔드 개발자</p>

			<h1
				id="home-hero-title"
				className="text-foreground tracking-hero w420:text-4xl mb-5 text-2xl leading-tight font-extrabold text-pretty"
			>
				안녕하세요, <span className="text-accent">여찬규</span>입니다.
			</h1>

			<p className="text-foreground leading-prose max-w-160 text-lg text-pretty">
				사용자 경험과 인터페이스 개선에 중점을 두고 끊임없이 배우고 성장하는 개발자입니다. 디자인과 개발 사이에서 최적의
				균형을 찾는 데 열정을 가지고 있습니다.
			</p>

			<div className="mt-6">
				<SocialLinks items={socialItems} />
			</div>

			<p className="text-muted-foreground border-border-subtle text-subtitle leading-body mt-8 hidden max-w-prose border-t pt-6 text-pretty lg:block">
				이 블로그는 프론트엔드 개발 과정에서 배운 것들과 경험을 기록하고 공유하는 공간입니다. React, TypeScript, 웹 성능
				최적화 등 실무에서 마주하는 다양한 주제를 다룹니다.
			</p>
		</section>
	);
}
