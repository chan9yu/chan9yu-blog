import Image from "next/image";

import { cn } from "@/shared/lib/cn";

type ThumbnailProps = {
	src: string | null;
	alt?: string;
	sizes: string;
	priority?: boolean;
	rounded?: boolean;
	className?: string;
};

export function Thumbnail({ src, alt = "", sizes, priority = false, rounded = false, className }: ThumbnailProps) {
	return (
		<div
			className={cn(
				"bg-bg-subtle border-border-subtle aspect-og relative w-full overflow-hidden",
				rounded ? "rounded-md border" : "border-b",
				!src && "bg-post-placeholder",
				className
			)}
		>
			{src && (
				<Image
					src={src}
					alt={alt}
					fill
					priority={priority}
					loading={priority ? "eager" : "lazy"}
					sizes={sizes}
					className="object-cover transition-transform duration-500 group-hover:will-change-transform motion-safe:group-hover:scale-105"
				/>
			)}
		</div>
	);
}
