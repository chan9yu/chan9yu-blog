"use client";

import { useTheme as useNextTheme } from "next-themes";

import { useHydrated } from "@/shared/lib/browser/useHydrated";

type Theme = "light" | "dark";

export function useTheme() {
	const { resolvedTheme, setTheme: setNextTheme } = useNextTheme();
	const mounted = useHydrated();

	const currentTheme: Theme | null = mounted ? (resolvedTheme === "dark" ? "dark" : "light") : null;

	const applyWithTransition = (theme: Theme) => {
		const apply = () => setNextTheme(theme);

		if (typeof document.startViewTransition !== "function") {
			apply();
			return;
		}

		document.documentElement.dataset.vt = "theme";
		const transition = document.startViewTransition(apply);
		void transition.finished.finally(() => {
			delete document.documentElement.dataset.vt;
		});
	};

	const toggleTheme = () => {
		if (currentTheme === null) return;
		applyWithTransition(currentTheme === "dark" ? "light" : "dark");
	};

	return {
		resolvedTheme: currentTheme,
		toggleTheme
	};
}
