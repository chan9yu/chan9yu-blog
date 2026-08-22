"use client";

import { useEffect, useRef } from "react";

export function useRafCallback<Args extends unknown[]>(callback: (...args: Args) => void): (...args: Args) => void {
	const rafRef = useRef<number | undefined>(undefined);
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	});

	useEffect(() => {
		return () => {
			if (rafRef.current !== undefined) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, []);

	return (...args: Args) => {
		if (rafRef.current !== undefined) {
			cancelAnimationFrame(rafRef.current);
		}
		rafRef.current = requestAnimationFrame(() => {
			rafRef.current = undefined;
			callbackRef.current(...args);
		});
	};
}
