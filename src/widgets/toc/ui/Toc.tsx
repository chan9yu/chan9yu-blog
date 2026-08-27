"use client";

import { AlignLeft, X } from "lucide-react";
import type { MouseEvent } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { TocItem } from "@/entities/post";
import { useHydrated } from "@/shared/lib/browser/useHydrated";
import { cn } from "@/shared/lib/cn";
import { Drawer } from "@/shared/ui/Drawer";

type TocProps = {
	items: TocItem[];
};

const SCROLL_TOP_THRESHOLD_PX = 100;
const ACTIVE_LINK_MARGIN_PX = 24;
const INTERSECTION_ROOT_MARGIN = "-100px 0px -66% 0px";

const TOC_LINK_BASE_CLASS =
	"focus-visible:ring-ring pointer-coarse:min-h-11 flex min-h-8 items-center rounded-r border-l-2 py-1.5 pl-3 text-xs leading-snug transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";

const TOC_LINK_STATE_CLASS: Record<"active" | "inactive", string> = {
	active: "border-accent text-accent font-semibold",
	inactive: "border-transparent text-muted-foreground font-normal"
};

const LEVEL_PADDING_CLASS: Record<1 | 2 | 3, string> = {
	1: "pl-0",
	2: "pl-3",
	3: "pl-6"
};

export function Toc({ items }: TocProps) {
	const [activeId, setActiveId] = useState<string | null>(null);
	const [isMobileOpen, setIsMobileOpen] = useState(false);
	const listRef = useRef<HTMLUListElement>(null);
	const mounted = useHydrated();
	const mobileTitleId = useId();

	useEffect(() => {
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

	useEffect(() => {
		if (!activeId) return;

		const list = listRef.current;
		if (!list) return;

		const link = Array.from(list.querySelectorAll<HTMLElement>("[data-toc-id]")).find(
			(element) => element.dataset.tocId === activeId
		);
		if (!link) return;

		const listRect = list.getBoundingClientRect();
		const linkRect = link.getBoundingClientRect();
		const overflowTop = linkRect.top - listRect.top - ACTIVE_LINK_MARGIN_PX;
		const overflowBottom = linkRect.bottom - listRect.bottom + ACTIVE_LINK_MARGIN_PX;

		if (overflowTop < 0) {
			list.scrollTop += overflowTop;
			return;
		}

		if (overflowBottom > 0) {
			list.scrollTop += overflowBottom;
		}
	}, [activeId]);

	const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();

		const id = event.currentTarget.dataset.tocId;
		if (!id) return;

		const element = document.getElementById(id);
		if (!element) return;

		element.scrollIntoView();
		window.history.replaceState(null, "", `#${id}`);

		if (isMobileOpen) {
			setIsMobileOpen(false);
			return;
		}

		element.focus({ preventScroll: true });
	};

	const handleCloseMobile = () => setIsMobileOpen(false);

	const tocItems = items.map((item) => {
		const isActive = activeId === item.id;
		return (
			<li key={item.id} className={LEVEL_PADDING_CLASS[item.level]}>
				<a
					href={`#${item.id}`}
					data-toc-id={item.id}
					onClick={handleClick}
					aria-current={isActive ? "location" : undefined}
					className={cn(TOC_LINK_BASE_CLASS, TOC_LINK_STATE_CLASS[isActive ? "active" : "inactive"])}
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
				<ul ref={listRef} className="max-h-toc space-y-1 overflow-y-auto scroll-smooth pr-2">
					{tocItems}
				</ul>
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
							className="bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-ring z-sticky fixed bottom-4 left-4 flex size-11 cursor-pointer items-center justify-center rounded-full transition duration-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-safe:active:scale-98 lg:hidden"
						>
							<AlignLeft className="size-5" aria-hidden />
						</button>

						<Drawer
							id="mobile-toc-sheet"
							open={isMobileOpen}
							onClose={handleCloseMobile}
							side="bottom"
							aria-labelledby={mobileTitleId}
							panelClassName="flex flex-col"
						>
							<div className="border-border-subtle flex shrink-0 items-center justify-between border-b px-6 py-4">
								<h2 id={mobileTitleId} className="text-lg font-bold">
									목차
								</h2>
								<button
									type="button"
									onClick={handleCloseMobile}
									aria-label="목차 닫기"
									className="text-muted-foreground hover:bg-bg-subtle hover:text-foreground focus-visible:ring-ring flex size-11 cursor-pointer items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
								>
									<X className="size-5" aria-hidden />
								</button>
							</div>

							<nav
								aria-label="목차 (모바일)"
								className="min-h-0 flex-1 overflow-y-auto p-6 [&_a]:border-l-0 [&_a]:pl-0"
							>
								<ul>{tocItems}</ul>
							</nav>
						</Drawer>
					</>,
					document.body
				)}
		</>
	);
}
