"use client";

import { useEffect, useState } from "react";

import { fetchPostViewsOrNull, incrementPostViews } from "../api/kv-client";

const SESSION_KEY_PREFIX = "views:incremented:";

function sessionKey(slug: string) {
	return `${SESSION_KEY_PREFIX}${slug}`;
}

function wasIncrementedThisSession(slug: string) {
	try {
		return typeof sessionStorage !== "undefined" && sessionStorage.getItem(sessionKey(slug)) === "1";
	} catch {
		return false;
	}
}

function markIncrementedThisSession(slug: string) {
	try {
		sessionStorage.setItem(sessionKey(slug), "1");
	} catch {}
}

type UseViewsState = {
	views: number | null;
	failed: boolean;
};

const INITIAL_STATE: UseViewsState = { views: null, failed: false };

export function useViews(slug: string) {
	const [state, setState] = useState<UseViewsState>(INITIAL_STATE);

	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			if (!wasIncrementedThisSession(slug)) {
				markIncrementedThisSession(slug);
				await incrementPostViews(slug);
			}

			const value = await fetchPostViewsOrNull(slug);
			if (cancelled) return;

			setState(value === null ? { views: null, failed: true } : { views: value, failed: false });
		};

		void load();

		return () => {
			cancelled = true;
		};
	}, [slug]);

	return state;
}
