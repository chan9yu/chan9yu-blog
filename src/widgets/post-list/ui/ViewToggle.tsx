"use client";

import { LayoutGrid, List } from "lucide-react";

import { cn } from "@/shared/lib/cn";

import type { ViewMode } from "./PostViewSwap";

const TOGGLE_BUTTON_BASE_CLASS =
	"focus-visible:ring-ring relative flex size-9 cursor-pointer items-center justify-center rounded-md transition-colors duration-100 focus-visible:ring-2 focus-visible:outline-none";

const TOGGLE_BUTTON_STATE_CLASS: Record<"active" | "inactive", string> = {
	active: "text-foreground",
	inactive: "text-muted-foreground hover:text-foreground"
};

function toggleButtonClass(active: boolean) {
	return cn(TOGGLE_BUTTON_BASE_CLASS, TOGGLE_BUTTON_STATE_CLASS[active ? "active" : "inactive"]);
}

type ViewToggleProps = {
	value: ViewMode;
	onChange: (next: ViewMode) => void;
};

export function ViewToggle({ value, onChange }: ViewToggleProps) {
	return (
		<div
			className="bg-muted border-border-subtle relative flex items-center gap-1 rounded-lg border p-1"
			role="toolbar"
			aria-label="뷰 모드"
		>
			<span
				aria-hidden
				className={cn(
					"bg-card pointer-events-none absolute top-1 left-1 size-9 rounded-md transition-transform duration-250 ease-out",
					value === "grid" && "translate-x-10"
				)}
			/>
			<button
				type="button"
				onClick={() => onChange("list")}
				aria-label="리스트 보기"
				aria-pressed={value === "list"}
				className={toggleButtonClass(value === "list")}
			>
				<List className="size-4" aria-hidden />
			</button>
			<button
				type="button"
				onClick={() => onChange("grid")}
				aria-label="격자 보기"
				aria-pressed={value === "grid"}
				className={toggleButtonClass(value === "grid")}
			>
				<LayoutGrid className="size-4" aria-hidden />
			</button>
		</div>
	);
}
