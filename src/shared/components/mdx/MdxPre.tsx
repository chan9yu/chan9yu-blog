"use client";

import { Check, Copy } from "lucide-react";
import type { ComponentProps } from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/shared/utils/cn";

const COPIED_FEEDBACK_MS = 2000;

type MdxPreProps = ComponentProps<"pre"> & {
	filename?: string;
};

export function MdxPre({ filename, className, children, ...rest }: MdxPreProps) {
	const preRef = useRef<HTMLPreElement>(null);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const timerId = window.setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
		return () => window.clearTimeout(timerId);
	}, [copied]);

	const handleCopy = async () => {
		const code = preRef.current?.innerText ?? "";

		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
		} catch {
			setCopied(false);
		}
	};

	return (
		<div className="group relative my-6">
			{filename && (
				<div className="border-border-subtle bg-muted text-muted-foreground rounded-t-md border border-b-0 px-4 py-1.5 font-mono text-xs">
					{filename}
				</div>
			)}
			<pre
				ref={preRef}
				className={cn(
					"border-border-subtle bg-muted overflow-x-auto border p-4 font-mono text-sm leading-relaxed",
					filename ? "rounded-b-md" : "rounded-md",
					className
				)}
				{...rest}
			>
				{children}
			</pre>
			<button
				type="button"
				onClick={handleCopy}
				aria-label={copied ? "복사됨" : "코드 복사"}
				className="bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring border-border-subtle absolute top-2 right-2 inline-flex size-9 cursor-pointer items-center justify-center rounded-md border opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
			>
				{copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
			</button>
		</div>
	);
}
