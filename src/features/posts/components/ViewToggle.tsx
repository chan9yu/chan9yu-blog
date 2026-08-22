"use client";

import { cva } from "class-variance-authority";
import { LayoutGrid, List } from "lucide-react";

import { useHydrated } from "@/shared/hooks/useHydrated";

import { useViewMode } from "../hooks/useViewMode";

const toggleButton = cva(
	"focus-visible:ring-ring flex size-9 cursor-pointer items-center justify-center rounded-md transition-[background-color,color] duration-100 focus-visible:ring-2 focus-visible:outline-none",
	{
		variants: {
			active: {
				true: "bg-card text-foreground",
				false: "text-muted-foreground hover:bg-bg-subtle/50 hover:text-foreground"
			}
		}
	}
);

export function ViewToggle() {
	const { view, setView } = useViewMode();
	const hydrated = useHydrated();
	const effectiveView = hydrated ? view : "grid";

	const handleSelectListView = () => setView("list");
	const handleSelectGridView = () => setView("grid");

	return (
		<div
			className="bg-bg-muted border-border-subtle hidden items-center gap-1 rounded-lg border p-1 sm:flex"
			role="toolbar"
			aria-label="뷰 모드"
		>
			<button
				type="button"
				onClick={handleSelectListView}
				aria-label="리스트 보기"
				aria-pressed={effectiveView === "list"}
				className={toggleButton({ active: effectiveView === "list" })}
			>
				<List className="size-4" aria-hidden />
			</button>
			<button
				type="button"
				onClick={handleSelectGridView}
				aria-label="격자 보기"
				aria-pressed={effectiveView === "grid"}
				className={toggleButton({ active: effectiveView === "grid" })}
			>
				<LayoutGrid className="size-4" aria-hidden />
			</button>
		</div>
	);
}
