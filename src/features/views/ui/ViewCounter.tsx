"use client";

import { Eye } from "lucide-react";

import { useViews } from "../model/useViews";

type ViewCounterProps = {
	slug: string;
};

export function ViewCounter({ slug }: ViewCounterProps) {
	const { views, failed } = useViews(slug);

	if (failed) {
		return (
			<span
				className="text-muted-foreground inline-flex items-center gap-1.5 text-sm"
				aria-label="조회수를 불러오지 못했습니다"
			>
				<Eye className="size-4" aria-hidden />
				<span aria-hidden>조회 –</span>
			</span>
		);
	}

	if (views === null) {
		return (
			<span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm" aria-label="조회수 불러오는 중">
				<Eye className="size-4" aria-hidden />
				<span aria-hidden className="bg-bg-muted inline-block h-4 w-12 animate-pulse rounded" />
			</span>
		);
	}

	return (
		<span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm tabular-nums">
			<Eye className="size-4" aria-hidden />
			조회 {views.toLocaleString("ko-KR")}
		</span>
	);
}
