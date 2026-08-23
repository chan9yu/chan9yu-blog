import { useSyncExternalStore } from "react";

const VIEW_STORAGE_KEY = "blog:posts:view";
const VIEW_CHANGE_EVENT = "blog:posts:view:change";

export type ViewMode = "list" | "grid";

function subscribe(callback: () => void) {
	window.addEventListener(VIEW_CHANGE_EVENT, callback);
	window.addEventListener("storage", callback);

	return () => {
		window.removeEventListener(VIEW_CHANGE_EVENT, callback);
		window.removeEventListener("storage", callback);
	};
}

function getSnapshot(): ViewMode {
	const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
	return stored === "list" ? "list" : "grid";
}

function getServerSnapshot(): ViewMode {
	return "grid";
}

export function useViewMode() {
	const view = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

	const setView = (next: ViewMode) => {
		window.localStorage.setItem(VIEW_STORAGE_KEY, next);
		window.dispatchEvent(new Event(VIEW_CHANGE_EVENT));
	};

	return {
		view,
		setView
	};
}
