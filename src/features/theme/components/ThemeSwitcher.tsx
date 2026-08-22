"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "../hooks/useTheme";

export function ThemeSwitcher() {
	const { resolvedTheme, toggleTheme, mounted } = useTheme();
	const isDark = resolvedTheme === "dark";

	return (
		<button
			type="button"
			onClick={toggleTheme}
			aria-label={isDark ? "라이트 모드로 변경" : "다크 모드로 변경"}
			aria-pressed={isDark}
			className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex size-11 cursor-pointer items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
		>
			{mounted ? (
				isDark ? (
					<Sun className="size-5" aria-hidden />
				) : (
					<Moon className="size-5" aria-hidden />
				)
			) : (
				<Sun className="size-5 opacity-0" aria-hidden />
			)}
		</button>
	);
}
