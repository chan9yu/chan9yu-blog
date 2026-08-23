"use client";

import { use } from "react";

import { LightboxContext } from "./LightboxContext";

export function useLightbox() {
	const context = use(LightboxContext);
	if (!context) {
		throw new Error("useLightbox는 <LightboxProvider> 내부에서만 호출할 수 있습니다.");
	}

	return context;
}
