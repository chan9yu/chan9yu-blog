"use client";

import { ChevronLeft, X } from "lucide-react";
import { useState } from "react";

import type { TocItem } from "@/shared/types";
import { cn } from "@/shared/utils/cn";

import { Toc } from "./Toc";

type PostTocAsideProps = {
	items: TocItem[];
};

export function PostTocAside({ items }: PostTocAsideProps) {
	const [isOpen, setIsOpen] = useState(true);

	if (items.length === 0) return null;

	return (
		<aside
			id="post-toc"
			aria-label="목차"
			className="hidden lg:sticky lg:top-24 lg:ml-12 lg:grid lg:w-64 lg:flex-none lg:self-start"
		>
			<div data-toc-panel="" data-open={isOpen} className="col-start-1 row-start-1 space-y-3">
				<div className="flex justify-end">
					<button
						type="button"
						onClick={() => setIsOpen(false)}
						aria-label="목차 닫기"
						aria-expanded={true}
						aria-controls="post-toc"
						className={cn(
							"text-muted-foreground hover:text-foreground hover:bg-bg-subtle focus-visible:ring-ring",
							"flex size-11 cursor-pointer items-center justify-center rounded-full",
							"transition-[background-color,color,transform] duration-100 focus-visible:ring-2 focus-visible:outline-none",
							"motion-safe:active:scale-[0.98]"
						)}
					>
						<X className="size-4" aria-hidden />
					</button>
				</div>
				<Toc items={items} />
			</div>

			<div data-toc-opener="" data-open={!isOpen} className="col-start-1 row-start-1 flex justify-end self-start">
				<button
					type="button"
					onClick={() => setIsOpen(true)}
					aria-label="목차 열기"
					aria-expanded={false}
					aria-controls="post-toc"
					className={cn(
						"text-muted-foreground hover:text-foreground hover:bg-bg-subtle focus-visible:ring-ring",
						"flex size-11 cursor-pointer items-center justify-center rounded-full",
						"transition-[background-color,color,transform] duration-100 focus-visible:ring-2 focus-visible:outline-none",
						"motion-safe:active:scale-[0.98]"
					)}
				>
					<ChevronLeft className="size-5" aria-hidden />
				</button>
			</div>
		</aside>
	);
}
