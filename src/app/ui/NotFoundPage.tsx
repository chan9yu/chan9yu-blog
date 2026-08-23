import type { Metadata } from "next";

import { NOT_FOUND_METADATA } from "@/shared/seo";
import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";

export const notFoundMetadata: Metadata = { ...NOT_FOUND_METADATA, title: "페이지를 찾을 수 없습니다" };

export function NotFoundPage() {
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
