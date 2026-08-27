"use client";

import type { LucideIcon } from "lucide-react";
import { Check, Copy, X } from "lucide-react";
import type { ComponentProps } from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/shared/lib/cn";

const COPIED_FEEDBACK_MS = 2000;

type CopyStatus = "idle" | "copied" | "failed";

const COPY_LABEL: Record<CopyStatus, string> = {
	idle: "코드 복사",
	copied: "복사됨",
	failed: "복사 실패"
};

const COPY_ICON: Record<CopyStatus, LucideIcon> = {
	idle: Copy,
	copied: Check,
	failed: X
};

export function MdxPre({ className, children, ...rest }: ComponentProps<"pre">) {
	const preRef = useRef<HTMLPreElement>(null);
	const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

	useEffect(() => {
		if (copyStatus === "idle") return;
		const timerId = window.setTimeout(() => setCopyStatus("idle"), COPIED_FEEDBACK_MS);
		return () => window.clearTimeout(timerId);
	}, [copyStatus]);

	const handleCopy = async () => {
		const code = preRef.current?.innerText ?? "";

		try {
			await navigator.clipboard.writeText(code);
			setCopyStatus("copied");
		} catch (error) {
			console.warn("[mdx-pre] clipboard write failed", error);
			setCopyStatus("failed");
		}
	};

	const StatusIcon = COPY_ICON[copyStatus];

	return (
		<div className="group relative my-6">
			<div className="relative">
				<pre
					ref={preRef}
					className={cn(
						"border-border-subtle bg-muted overflow-x-auto rounded-md border p-4 font-mono text-sm leading-relaxed",
						className
					)}
					{...rest}
				>
					{children}
				</pre>
				<button
					type="button"
					onClick={handleCopy}
					aria-label={COPY_LABEL[copyStatus]}
					className={cn(
						"bg-card text-muted-foreground hover:text-foreground focus-visible:ring-ring border-border-control hover:border-accent absolute top-2 right-2 inline-flex size-11 cursor-pointer items-center justify-center rounded-lg border opacity-0 shadow-sm transition duration-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:outline-none motion-safe:active:scale-98",
						copyStatus === "failed" && "text-destructive border-destructive hover:text-destructive opacity-100"
					)}
				>
					<StatusIcon className="size-4" aria-hidden />
				</button>
			</div>
			<span role="status" aria-live="polite" className="sr-only">
				{copyStatus === "copied" && "코드가 복사되었습니다"}
				{copyStatus === "failed" && "복사에 실패했습니다"}
			</span>
		</div>
	);
}
