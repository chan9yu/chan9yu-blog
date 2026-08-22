"use client";

import { useEffect, useRef } from "react";

export function useSearchShortcut(callback: () => void) {
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	});

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				callbackRef.current();
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);
}
