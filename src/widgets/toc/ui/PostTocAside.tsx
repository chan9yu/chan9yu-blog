"use client";

import { ChevronLeft, X } from "lucide-react";
import { useState } from "react";

import type { TocItem } from "@/entities/post";
import { cn } from "@/shared/lib/cn";

import { Toc } from "./Toc";

const TOC_TOGGLE_CLASS =
	"text-muted-foreground hover:text-foreground hover:bg-bg-subtle focus-visible:ring-ring flex size-11 cursor-pointer items-center justify-center rounded-full transition duration-100 focus-visible:ring-2 focus-visible:outline-none motion-safe:active:scale-98";

type PostTocAsideProps = {
	items: TocItem[];
};

export function PostTocAside({ items }: PostTocAsideProps) {
	const [isOpen, setIsOpen] = useState(true);

	if (items.length === 0) return null;

	return (
		<div
			id="post-toc"
			className={cn(
				"relative hidden lg:sticky lg:top-(--sticky-offset) lg:block lg:self-start",
				"lg:transition-rail lg:duration-300",
				isOpen ? "lg:ml-14 lg:w-58" : "lg:ml-0 lg:w-13 lg:overflow-hidden"
			)}
		>
			<div data-toc-panel="" data-open={isOpen} className={cn("w-58 space-y-3", !isOpen && "absolute top-0 right-0")}>
				<div className="flex justify-end">
					<button
						type="button"
						onClick={() => setIsOpen(false)}
						aria-label="목차 닫기"
						aria-expanded={true}
						aria-controls="post-toc"
						className={TOC_TOGGLE_CLASS}
					>
						<X className="size-4" aria-hidden />
					</button>
				</div>
				<Toc items={items} />
			</div>

			<div data-toc-opener="" data-open={!isOpen} className="flex w-13 justify-center">
				<button
					type="button"
					onClick={() => setIsOpen(true)}
					aria-label="목차 열기"
					aria-expanded={false}
					aria-controls="post-toc"
					className={TOC_TOGGLE_CLASS}
				>
					<ChevronLeft className="size-5" aria-hidden />
				</button>
			</div>
		</div>
	);
}
