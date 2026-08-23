"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

function calculateScrollProgress() {
	const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
	const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

	return scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
}

export function ReadingProgress() {
	const [progress, setProgress] = useState(0);
	const rafIdRef = useRef<number | null>(null);

	useEffect(() => {
		const schedule = () => {
			if (rafIdRef.current !== null) return;
			rafIdRef.current = requestAnimationFrame(() => {
				setProgress(calculateScrollProgress());
				rafIdRef.current = null;
			});
		};

		window.addEventListener("scroll", schedule, { passive: true });

		schedule();

		return () => {
			window.removeEventListener("scroll", schedule);

			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
			}
		};
	}, []);

	const progressStyle = { "--progress": progress / 100 } as CSSProperties & { "--progress": number };

	return (
		<div
			className="z-floating fixed inset-x-0 top-0"
			role="progressbar"
			aria-label="읽기 진행률"
			aria-valuenow={Math.round(progress)}
			aria-valuemin={0}
			aria-valuemax={100}
		>
			{progress > 0 && (
				<div
					className="reading-progress-bar bg-accent h-1 w-full origin-left transition-transform will-change-transform"
					style={progressStyle}
				/>
			)}
		</div>
	);
}
