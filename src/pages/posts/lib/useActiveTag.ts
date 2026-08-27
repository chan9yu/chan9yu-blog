import { useSyncExternalStore } from "react";

const TAG_PARAM = "tag";

const listeners = new Set<() => void>();

function notifyListeners() {
	for (const listener of listeners) {
		listener();
	}
}

function scheduleNotify() {
	queueMicrotask(notifyListeners);
}

let watching = false;

function watchUrlChanges() {
	if (watching) {
		return;
	}
	watching = true;

	const { pushState, replaceState } = window.history;

	window.history.pushState = function (this: History, ...args: Parameters<History["pushState"]>) {
		pushState.apply(this, args);
		scheduleNotify();
	};

	window.history.replaceState = function (this: History, ...args: Parameters<History["replaceState"]>) {
		replaceState.apply(this, args);
		scheduleNotify();
	};

	window.addEventListener("popstate", scheduleNotify);
}

const subscribe = (listener: () => void) => {
	watchUrlChanges();
	listeners.add(listener);

	return () => {
		listeners.delete(listener);
	};
};

const getSnapshot = () => new URLSearchParams(window.location.search).get(TAG_PARAM);
const getServerSnapshot = () => null;

export function useActiveTag() {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function pushActiveTag(tag: string | null) {
	const url = tag === null ? "/posts" : `/posts?${TAG_PARAM}=${encodeURIComponent(tag)}`;
	window.history.pushState(null, "", url);
}
