import { socialItems } from "@/shared/ui/socialItems";
import { SocialLinks } from "@/shared/ui/SocialLinks";

export function HomeHero() {
	return (
		<section className="space-y-4 sm:space-y-6" aria-labelledby="home-hero-title">
			<div className="space-y-3 sm:space-y-4">
				<h1
					id="home-hero-title"
					className="text-foreground tracking-hero text-3xl leading-tight font-extrabold text-balance min-[420px]:text-4xl"
				>
					안녕하세요 <span aria-hidden>👋</span>
					<br />
					<span className="text-accent">프론트엔드 개발자</span> 여찬규입니다.
				</h1>
				<div className="text-muted-foreground max-w-2xl space-y-3 text-sm leading-relaxed text-pretty sm:space-y-4 sm:text-base md:text-lg">
					<p>
						사용자 경험과 인터페이스 개선에 중점을 두고 끊임없이 배우고 성장하는 개발자입니다.
						<br />
						디자인과 개발 사이에서 최적의 균형을 찾는 데 열정을 가지고 있습니다.
					</p>
					<p>
						이 블로그는 프론트엔드 개발 과정에서 배운 것들과 경험을 기록하고 공유하는 공간입니다.
						<br />
						React, TypeScript, 웹 성능 최적화 등 실무에서 마주하는 다양한 주제를 다룹니다.
					</p>
				</div>
			</div>

			<SocialLinks items={socialItems} />
		</section>
	);
}
