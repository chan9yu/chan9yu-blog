"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useId, useState } from "react";

import { cn } from "@/shared/lib/cn";
import { Dialog } from "@/shared/ui/Dialog";

import type { LightboxImage } from "../model/LightboxContext";

const CONTROL_CLASS =
	"focus-visible:ring-ring absolute inline-flex size-12 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";

type ImageLightboxProps = {
	open: boolean;
	images: ReadonlyArray<LightboxImage>;
	index: number;
	onNext: () => void;
	onPrev: () => void;
	onClose: () => void;
};

const SLIDE_DISTANCE_PX = 100;

export function ImageLightbox({ open, images, index, onNext, onPrev, onClose }: ImageLightboxProps) {
	const current = images[index];
	const hasMultiple = images.length > 1;
	const [direction, setDirection] = useState(0);
	const titleId = useId();

	useEffect(() => {
		if (!open || !hasMultiple) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "ArrowRight") {
				setDirection(1);
				onNext();
			} else if (event.key === "ArrowLeft") {
				setDirection(-1);
				onPrev();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [open, hasMultiple, onNext, onPrev]);

	const handleNext = () => {
		setDirection(1);
		onNext();
	};

	const handlePrev = () => {
		setDirection(-1);
		onPrev();
	};

	if (!current) {
		return null;
	}

	const slideStyle = { "--slide-from": `${direction * SLIDE_DISTANCE_PX}px` } as CSSProperties;

	return (
		<Dialog
			open={open}
			onClose={onClose}
			data-lightbox=""
			aria-labelledby={titleId}
			panelClassName="flex items-center justify-center"
		>
			<h2 id={titleId} className="sr-only">
				이미지 확대
			</h2>
			<p className="sr-only">{current.alt}</p>

			<div key={index} data-lightbox-slide="" style={slideStyle} className="flex items-center justify-center">
				<Image
					src={current.src}
					alt={current.alt}
					width={0}
					height={0}
					sizes="100vw"
					unoptimized
					className="max-h-lightbox max-w-lightbox h-auto w-auto"
				/>
			</div>

			{hasMultiple && (
				<>
					<button
						type="button"
						onClick={handlePrev}
						aria-label="이전 이미지"
						className={cn(CONTROL_CLASS, "top-1/2 left-6 -translate-y-1/2")}
					>
						<ChevronLeft className="size-6" aria-hidden />
					</button>
					<button
						type="button"
						onClick={handleNext}
						aria-label="다음 이미지"
						className={cn(CONTROL_CLASS, "top-1/2 right-6 -translate-y-1/2")}
					>
						<ChevronRight className="size-6" aria-hidden />
					</button>
				</>
			)}

			<button
				type="button"
				onClick={onClose}
				aria-label="이미지 확대 닫기"
				className={cn(CONTROL_CLASS, "top-6 right-6")}
			>
				<X className="size-5" aria-hidden />
			</button>
		</Dialog>
	);
}
