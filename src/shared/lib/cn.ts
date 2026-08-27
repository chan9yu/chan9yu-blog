import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge는 globals.css @theme의 커스텀 폰트 크기 유틸을 알지 못해 색상 유틸과 같은 그룹으로 보고 지운다
const twMerge = extendTailwindMerge({
	extend: {
		classGroups: {
			"font-size": [
				"text-chip",
				"text-subtitle",
				"text-11",
				"text-12",
				"text-13",
				"text-14",
				"text-15",
				"text-16",
				"text-17"
			]
		}
	}
});

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
