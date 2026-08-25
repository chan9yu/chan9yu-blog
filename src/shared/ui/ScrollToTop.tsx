"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/shared/lib/cn";

const SCROLL_THRESHOLD = 300;

export function ScrollToTop() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setVisible(window.scrollY > SCROLL_THRESHOLD);
		};

		handleScroll();

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const handleClick = () => window.scrollTo({ top: 0, behavior: "smooth" });

	return (
		<button
			type="button"
			onClick={handleClick}
			aria-label="맨 위로 이동"
			inert={!visible ? true : undefined}
			className={cn(
				"bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-ring z-floating shadow-floating fixed right-4 bottom-4 inline-flex size-11 cursor-pointer items-center justify-center rounded-full transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none print:hidden",
				visible
					? "ease-enter translate-y-0 opacity-100 duration-250"
					: "ease-exit pointer-events-none translate-y-16 opacity-0 duration-200"
			)}
		>
			<ArrowUp className="size-6" aria-hidden />
		</button>
	);
}
