import { Rss } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { APP_VERSION } from "@/shared/config/site";

import { Container } from "./Container";

type FooterLink = {
	href: string;
	label: string;
	external: boolean;
	icon?: ReactNode;
};

const FOOTER_LINKS: ReadonlyArray<FooterLink> = [
	{ href: "/rss", label: "RSS", external: true, icon: <Rss className="size-4" aria-hidden /> },
	{ href: "https://github.com/chan9yu", label: "GitHub", external: true },
	{ href: "mailto:dev.cgyeo@gmail.com", label: "Email", external: false }
];

const BUILD_YEAR = new Date().getFullYear();

export function Footer() {
	return (
		<>
			<footer className="border-border-subtle mt-24 border-t pt-12 pb-8">
				<Container>
					<div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
						<div className="space-y-2">
							<p className="text-foreground text-sm font-medium">@chan9yu&apos;s dev blog</p>
							<p className="text-muted-foreground text-sm leading-relaxed">
								프론트엔드 개발의 아이디어와 경험을 기록하는 개발 블로그
								<br />
								코드와 디자인, 사용자 경험을 아우르는 인사이트를 담습니다.
							</p>
						</div>

						<nav className="flex flex-wrap items-center gap-6" aria-label="푸터 링크">
							{FOOTER_LINKS.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									target={link.external ? "_blank" : undefined}
									rel={link.external ? "noopener noreferrer" : undefined}
									className="text-muted-foreground hover:text-accent focus-visible:ring-ring inline-flex items-center gap-1.5 rounded text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
								>
									{link.icon}
									{link.label}
									{link.external && <span className="sr-only"> (새 창에서 열림)</span>}
								</Link>
							))}
						</nav>
					</div>

					<div className="border-border-subtle text-muted-foreground mt-8 border-t pt-6 text-center text-sm">
						<span>© {BUILD_YEAR} chan9yu. All rights reserved.</span>
					</div>
				</Container>
			</footer>

			<a
				href={`https://github.com/chan9yu/dev-blog/releases/tag/v${APP_VERSION}`}
				target="_blank"
				rel="noopener noreferrer"
				className="text-muted-foreground hover:text-accent focus-visible:ring-ring fixed bottom-4 left-4 z-30 hidden rounded text-xs opacity-50 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:inline-block"
				aria-label={`현재 배포 버전 v${APP_VERSION} (GitHub Release 보기)`}
			>
				v{APP_VERSION}
			</a>
		</>
	);
}
