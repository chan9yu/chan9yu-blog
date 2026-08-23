import type { Metadata } from "next";

import { getSiteUrl, siteMetadata, siteSocials } from "@/shared/config/site";
import { buildPersonJsonLd, JsonLdScript } from "@/shared/seo";
import { buildMetadata } from "@/shared/seo";
import { Container } from "@/shared/ui/Container";

import { AboutProfile } from "./AboutProfile";

export const metadata: Metadata = buildMetadata({
	title: "About",
	description:
		"프론트엔드 개발자 여찬규(chan9yu)의 자기소개. 3년차 실무 경험과 React·TypeScript·Next.js·WebRTC 기반 실시간 통신 프로젝트, 학습 태도와 관심 분야를 정리했고, 협업·연락처도 함께 안내합니다.",
	path: "/about"
});

const personJsonLd = buildPersonJsonLd({
	name: siteMetadata.author,
	url: `${getSiteUrl()}/about`,
	sameAs: siteSocials.map((s) => s.href)
});

export function AboutPage() {
	return (
		<>
			<JsonLdScript id="about-person-json-ld" data={personJsonLd} />
			<Container>
				<div className="py-10 lg:py-14">
					<AboutProfile />
				</div>
			</Container>
		</>
	);
}
