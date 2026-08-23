"use client";

import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";

import { LightboxProvider } from "@/features/lightbox";

export function Providers({ children }: PropsWithChildren) {
	return (
		<ThemeProvider attribute="class" enableColorScheme={false} defaultTheme="system" disableTransitionOnChange>
			<LightboxProvider>{children}</LightboxProvider>
		</ThemeProvider>
	);
}
