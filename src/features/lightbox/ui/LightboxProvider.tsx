"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useState } from "react";

import type { LightboxImage } from "../model/LightboxContext";
import { LightboxContext } from "../model/LightboxContext";

const ImageLightbox = dynamic(() => import("./ImageLightbox").then((mod) => ({ default: mod.ImageLightbox })), {
	ssr: false
});

type LightboxState = {
	images: ReadonlyArray<LightboxImage>;
	index: number;
	open: boolean;
};

const INITIAL_STATE: LightboxState = { images: [], index: 0, open: false };

type LightboxProviderProps = {
	children: ReactNode;
};

export function LightboxProvider({ children }: LightboxProviderProps) {
	const [state, setState] = useState<LightboxState>(INITIAL_STATE);

	const open = (image: LightboxImage) => {
		setState({ images: [image], index: 0, open: true });
	};

	const openMany = (images: ReadonlyArray<LightboxImage>, startIndex = 0) => {
		if (images.length === 0) return;
		const bounded = Math.max(0, Math.min(startIndex, images.length - 1));
		setState({ images, index: bounded, open: true });
	};

	const close = () => {
		setState((prev) => ({ ...prev, open: false }));
	};

	const goNext = () => {
		setState((prev) => {
			if (prev.images.length === 0) return prev;
			return { ...prev, index: (prev.index + 1) % prev.images.length };
		});
	};

	const goPrev = () => {
		setState((prev) => {
			if (prev.images.length === 0) return prev;
			return { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length };
		});
	};

	const hasOpened = state.images.length > 0;

	return (
		<LightboxContext value={{ open, openMany, close }}>
			{children}
			{hasOpened && (
				<ImageLightbox
					open={state.open}
					images={state.images}
					index={state.index}
					onNext={goNext}
					onPrev={goPrev}
					onClose={close}
				/>
			)}
		</LightboxContext>
	);
}
