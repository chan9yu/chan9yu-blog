"use client";

import { cva } from "class-variance-authority";
import { AlignLeft, X } from "lucide-react";
import type { MouseEvent } from "react";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { Drawer } from "@/shared/components/ui/Drawer";
import type { TocItem } from "@/shared/types";

type TocProps = {
	items: TocItem[];
};

const SCROLL_TOP_THRESHOLD_PX = 100;
const INTERSECTION_ROOT_MARGIN = "-100px 0px -66% 0px";

const tocLink = cva(
	"focus-visible:ring-ring block rounded border-l-2 pl-2 text-sm transition-[color,border-color] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
	{
		variants: {
			active: {
				true: "border-accent text-accent font-semibold",
				false: "border-transparent text-muted-foreground font-normal"
			}
		}
	}
);

function subscribe() {
	return () => {};
}
function getClientSnapshot() {
	return true;
}
function getServerSnapshot() {
	return false;
}

const LEVEL_PADDING_CLASS: Record<1 | 2 | 3, string> = {
	1: "pl-0",
	2: "pl-3",
	3: "pl-6"
};

export function Toc({ items }: TocProps) {
	const [activeId, setActiveId] = useState<string | null>(null);
	const [isMobileOpen, setIsMobileOpen] = useState(false);
	const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
	const mobileTitleId = useId();

	useEffect(() => {
		if (items.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (window.scrollY < SCROLL_TOP_THRESHOLD_PX) {
					setActiveId(null);
					return;
				}

				const visible = entries.filter((entry) => entry.isIntersecting);
				if (visible.length === 0) {
					return;
				}

				const topmost = visible.reduce((top, entry) =>
					entry.boundingClientRect.top < top.boundingClientRect.top ? entry : top
				);

				setActiveId(topmost.target.id);
			},
			{
				rootMargin: INTERSECTION_ROOT_MARGIN,
				threshold: [0, 0.5, 1]
			}
		);

		items.forEach(({ id }) => {
			const element = document.getElementById(id);
			if (element) {
				observer.observe(element);
			}
		});

		return () => {
			observer.disconnect();
		};
	}, [items]);

	const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();

		const id = event.currentTarget.dataset.tocId;
		if (!id) return;

		const element = document.getElementById(id);
		if (!element) return;

		element.scrollIntoView();
		window.history.replaceState(null, "", `#${id}`);
		setIsMobileOpen(false);
	};

	const handleCloseMobile = () => setIsMobileOpen(false);

	if (items.length === 0) {
		return null;
	}

	const tocItems = items.map((item) => {
		const isActive = activeId === item.id;
		return (
			<li key={item.id} className={LEVEL_PADDING_CLASS[item.level]}>
				<a
					href={`#${item.id}`}
					data-toc-id={item.id}
					onClick={handleClick}
					aria-current={isActive ? "location" : undefined}
					className={tocLink({ active: isActive })}
				>
					{item.text}
				</a>
			</li>
		);
	});

	return (
		<>
			<nav aria-label="목차" className="space-y-4">
				<h2 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">목차</h2>
				<ul className="max-h-toc space-y-2.5 overflow-y-auto pr-2">{tocItems}</ul>
			</nav>

			{mounted &&
				createPortal(
					<>
						<button
							type="button"
							onClick={() => setIsMobileOpen(true)}
							aria-label="목차 열기"
							aria-expanded={isMobileOpen}
							aria-controls="mobile-toc-sheet"
							className="bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-ring fixed bottom-6 left-6 z-40 flex size-12 cursor-pointer items-center justify-center rounded-full transition-[background-color,transform] duration-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-safe:active:scale-[0.98] lg:hidden"
						>
							<AlignLeft className="size-5" aria-hidden />
						</button>

						<Drawer
							id="mobile-toc-sheet"
							open={isMobileOpen}
							onClose={handleCloseMobile}
							side="bottom"
							aria-labelledby={mobileTitleId}
						>
							<div className="border-border-subtle bg-background sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4">
								<h2 id={mobileTitleId} className="text-lg font-bold">
									목차
								</h2>
								<button
									type="button"
									onClick={handleCloseMobile}
									aria-label="목차 닫기"
									className="text-muted-foreground hover:bg-bg-subtle hover:text-foreground focus-visible:ring-ring flex size-11 cursor-pointer items-center justify-center rounded-lg transition-[background-color,color] focus-visible:ring-2 focus-visible:outline-none"
								>
									<X className="size-5" aria-hidden />
								</button>
							</div>

							<nav aria-label="목차 (모바일)" className="p-6">
								<ul className="space-y-2.5">{tocItems}</ul>
							</nav>
						</Drawer>
					</>,
					document.body
				)}
		</>
	);
}
