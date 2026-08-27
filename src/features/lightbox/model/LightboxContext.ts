import { createContext } from "react";

export type LightboxImage = {
	src: string;
	alt: string;
};

export type LightboxContextValue = {
	open: (image: LightboxImage) => void;
	openMany: (images: ReadonlyArray<LightboxImage>, startIndex?: number) => void;
	close: () => void;
};

export const LightboxContext = createContext<LightboxContextValue | null>(null);
