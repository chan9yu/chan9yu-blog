import type { Metadata } from "next";

import { Container } from "@/shared/components/layouts/Container";
import { Button } from "@/shared/components/ui/Button";

export const metadata: Metadata = {
	title: "페이지를 찾을 수 없습니다",
	description: "요청하신 페이지가 존재하지 않습니다.",
	robots: { index: false, follow: false }
};

export default function NotFound() {
	return (
		<Container className="py-20">
			<div className="flex flex-col items-start gap-4">
				<p className="text-muted-foreground text-sm font-medium">404</p>
				<h1 className="text-foreground tracking-heading text-2xl leading-tight font-bold">페이지를 찾을 수 없습니다</h1>
				<p className="text-muted-foreground max-w-prose">
					요청하신 주소가 이동했거나 삭제되었을 수 있습니다. 주소를 다시 확인하거나 홈으로 돌아가 주세요.
				</p>
				<Button href="/" variant="accent" className="mt-2">
					홈으로 돌아가기
				</Button>
			</div>
		</Container>
	);
}
