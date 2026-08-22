"use client";

import { Search } from "lucide-react";

type SearchButtonProps = {
	onClick: () => void;
};

export function SearchButton({ onClick }: SearchButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label="검색 열기"
			aria-keyshortcuts="Meta+k Control+k"
			className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex size-11 cursor-pointer items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
		>
			<Search className="size-5" aria-hidden />
		</button>
	);
}
