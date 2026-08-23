"use client";

import { LayoutGrid, List } from "lucide-react";

import { cn } from "@/shared/lib/cn";

import { useViewMode } from "../model/useViewMode";

const TOGGLE_BUTTON_BASE_CLASS =
	"focus-visible:ring-ring flex size-9 cursor-pointer items-center justify-center rounded-md transition-[background-color,color] duration-100 focus-visible:ring-2 focus-visible:outline-none";

const TOGGLE_BUTTON_STATE_CLASS: Record<"active" | "inactive", string> = {
	active: "bg-card text-foreground",
	inactive: "text-muted-foreground hover:bg-bg-subtle/50 hover:text-foreground"
};

function toggleButtonClass(active: boolean) {
	return cn(TOGGLE_BUTTON_BASE_CLASS, TOGGLE_BUTTON_STATE_CLASS[active ? "active" : "inactive"]);
}

export function ViewToggle() {
	const { view, setView } = useViewMode();

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
				aria-pressed={view === "list"}
				className={toggleButtonClass(view === "list")}
			>
				<List className="size-4" aria-hidden />
			</button>
			<button
				type="button"
				onClick={handleSelectGridView}
				aria-label="격자 보기"
				aria-pressed={view === "grid"}
				className={toggleButtonClass(view === "grid")}
			>
				<LayoutGrid className="size-4" aria-hidden />
			</button>
		</div>
	);
}
