"use client";

import { type ComponentProps, type MouseEvent, useId } from "react";

import { type LightboxImage, useLightbox } from "@/features/lightbox";
import { cn } from "@/shared/lib/cn";

type MdxImageProps = ComponentProps<"img"> & {
	alt: string;
	caption?: string;
};

export function MdxImage({ alt, caption, className, src, ...rest }: MdxImageProps) {
	const { openMany } = useLightbox();
	const captionId = useId();

	const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
		if (typeof src !== "string" || !src) return;

		const article = event.currentTarget.closest("article");
		const root: ParentNode = article ?? document;
		const imgs = Array.from(root.querySelectorAll<HTMLImageElement>("figure img"));

		const images: LightboxImage[] = imgs
			.map((img) => ({ src: img.currentSrc || img.src, alt: img.alt }))
			.filter((image) => Boolean(image.src));

		if (images.length === 0) return;

		const triggerImg = event.currentTarget.querySelector<HTMLImageElement>("img");
		const triggerIndex = triggerImg ? imgs.indexOf(triggerImg) : -1;
		const startIndex = triggerIndex >= 0 ? triggerIndex : 0;

		openMany(images, startIndex);
	};

	return (
		<figure className="my-6">
			<button
				type="button"
				onClick={handleOpen}
				aria-label={`${alt} — 확대 보기`}
				aria-describedby={caption ? captionId : undefined}
				className="mx-auto block w-fit cursor-zoom-in rounded-lg border-0 bg-transparent p-0"
			>
				<img
					alt={alt}
					loading="lazy"
					decoding="async"
					src={typeof src === "string" ? src : undefined}
					className={cn("block h-auto max-w-full rounded-lg", className)}
					{...rest}
				/>
			</button>
			{caption && (
				<figcaption id={captionId} className="text-muted-foreground mt-2 text-center text-xs italic">
					{caption}
				</figcaption>
			)}
		</figure>
	);
}
