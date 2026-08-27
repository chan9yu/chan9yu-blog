"use client";

import { Eye } from "lucide-react";

import { useViews } from "../model/useViews";

type ViewCounterProps = {
	slug: string;
};

export function ViewCounter({ slug }: ViewCounterProps) {
	const state = useViews(slug);

	return (
		<span
			role="status"
			aria-live="polite"
			className="text-muted-foreground inline-flex items-center gap-1.5 text-sm tabular-nums"
		>
			<Eye className="size-4" aria-hidden />
			{state.status === "failed" && (
				<>
					<span aria-hidden>조회 –</span>
					<span className="sr-only">조회수를 불러오지 못했습니다</span>
				</>
			)}
			{state.status === "loading" && (
				<>
					<span aria-hidden className="bg-muted inline-block h-4 w-12 animate-pulse rounded" />
					<span className="sr-only">조회수 불러오는 중</span>
				</>
			)}
			{state.status === "loaded" && <>조회 {state.views.toLocaleString("ko-KR")}</>}
		</span>
	);
}
