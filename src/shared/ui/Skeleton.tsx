import { cn } from "@/shared/lib/cn";

type SkeletonProps = {
	className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
	return <div data-skeleton="" aria-hidden className={cn("bg-bg-subtle rounded-md", className)} />;
}
