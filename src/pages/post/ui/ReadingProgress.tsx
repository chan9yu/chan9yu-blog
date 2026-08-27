"use client";

import { useEffect, useRef, useState } from "react";

function calculateScrollProgress() {
	const scrollTop = window.scrollY;
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
				rafIdRef.current = null;
			}
		};
	}, []);

	const progressStyle = { transform: `scaleX(${progress / 100})` };

	return (
		<div
			className="z-floating fixed inset-x-0 top-0"
			role="progressbar"
			aria-label="읽기 진행률"
			aria-valuenow={Math.round(progress)}
			aria-valuemin={0}
			aria-valuemax={100}
		>
			<div
				className="bg-accent h-1 w-full origin-left transition-transform will-change-transform"
				style={progressStyle}
			/>
			{progress > 0 && (
				<div
					aria-hidden
					className="bg-accent pointer-events-none absolute inset-x-0 top-0 h-1 w-full origin-left opacity-50 blur-md transition-transform will-change-transform"
					style={progressStyle}
				/>
			)}
		</div>
	);
}
