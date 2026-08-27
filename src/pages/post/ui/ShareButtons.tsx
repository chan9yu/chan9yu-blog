"use client";

import { Share2 } from "lucide-react";
import { useEffect, useState } from "react";

const TOAST_DURATION_MS = 2000;

type ShareButtonsProps = {
	title: string;
	url: string;
};

export function ShareButtons({ title, url }: ShareButtonsProps) {
	const [toast, setToast] = useState<"copied" | "failed" | null>(null);

	useEffect(() => {
		if (!toast) return;
		const timerId = window.setTimeout(() => setToast(null), TOAST_DURATION_MS);
		return () => window.clearTimeout(timerId);
	}, [toast]);

	const handleShare = async () => {
		if (typeof navigator.share === "function") {
			try {
				await navigator.share({ title, url });
				return;
			} catch (error) {
				if (error instanceof Error && error.name === "AbortError") return;
			}
		}

		try {
			await navigator.clipboard.writeText(url);
			setToast("copied");
		} catch (error) {
			console.warn("[share] clipboard write failed", error);
			setToast("failed");
		}
	};

	return (
		<>
			<button
				type="button"
				onClick={handleShare}
				aria-label="공유하기"
				className="bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring group inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:gap-2 sm:px-4"
			>
				<Share2 className="size-4" aria-hidden />
				<span className="text-xs font-medium sm:text-sm">공유</span>
			</button>

			<div
				role="status"
				aria-live="polite"
				aria-atomic="true"
				className="z-toast pointer-events-none fixed bottom-20 left-1/2 -translate-x-1/2 sm:bottom-8"
			>
				{toast && (
					<div className="bg-card border-border text-foreground motion-safe:animate-fade-in rounded-lg border px-4 py-2 sm:px-6 sm:py-3">
						<p className="text-xs font-medium sm:text-sm">
							{toast === "copied" ? "링크가 복사되었습니다" : "링크를 복사하지 못했습니다"}
						</p>
					</div>
				)}
			</div>
		</>
	);
}
