"use client";

import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";

type CommentsSectionProps = {
	slug: string;
	isPrivate?: boolean;
};

type GiscusConfig = {
	repo: `${string}/${string}`;
	repoId: string;
	category: string;
	categoryId: string;
};

const GISCUS_ORIGIN = "https://giscus.app";
const GISCUS_SCRIPT_SRC = `${GISCUS_ORIGIN}/client.js`;

function readGiscusConfig() {
	const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
	const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
	const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
	const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

	if (!repo || !repoId || !category || !categoryId) return null;
	if (!repo.includes("/")) return null;

	return { repo: repo as GiscusConfig["repo"], repoId, category, categoryId };
}

function resolveGiscusTheme(resolvedTheme: string | undefined) {
	return resolvedTheme === "dark" ? "dark" : "light";
}

export function CommentsSection({ slug, isPrivate = false }: CommentsSectionProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [shouldLoad, setShouldLoad] = useState(false);
	const { resolvedTheme } = useTheme();
	const config = useMemo(() => readGiscusConfig(), []);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) {
					setShouldLoad(true);
					observer.disconnect();
				}
			},
			{ rootMargin: "200px" }
		);

		observer.observe(container);

		return () => {
			observer.disconnect();
		};
	}, []);

	useEffect(() => {
		if (!shouldLoad || !config) return;
		const container = containerRef.current;
		if (!container) return;

		const script = document.createElement("script");
		script.src = GISCUS_SCRIPT_SRC;
		script.async = true;
		script.crossOrigin = "anonymous";
		script.dataset.repo = config.repo;
		script.dataset.repoId = config.repoId;
		script.dataset.category = config.category;
		script.dataset.categoryId = config.categoryId;
		script.dataset.mapping = "specific";
		script.dataset.term = `posts/${slug}`;
		script.dataset.strict = "1";
		script.dataset.reactionsEnabled = "1";
		script.dataset.emitMetadata = "0";
		script.dataset.inputPosition = "bottom";
		script.dataset.theme = resolveGiscusTheme(resolvedTheme);
		script.dataset.lang = "ko";
		script.dataset.loading = "lazy";

		container.appendChild(script);

		return () => {
			if (script.parentNode) script.parentNode.removeChild(script);
			container.querySelector("iframe.giscus-frame")?.remove();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shouldLoad, slug, config]);

	useEffect(() => {
		if (!shouldLoad || !config) return;
		const iframe = containerRef.current?.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
		if (!iframe?.contentWindow) return;

		iframe.contentWindow.postMessage(
			{ giscus: { setConfig: { theme: resolveGiscusTheme(resolvedTheme) } } },
			GISCUS_ORIGIN
		);
	}, [resolvedTheme, shouldLoad, config]);

	if (isPrivate) return null;

	return (
		<section
			ref={containerRef}
			aria-labelledby="comments-title"
			className="border-border-subtle mt-16 border-t pt-8"
			data-post-slug={slug}
		>
			<h2 id="comments-title" className="text-foreground mb-6 text-xl font-bold tracking-tight">
				댓글
			</h2>

			{!config && (
				<div role="status" className="bg-muted text-muted-foreground min-h-32 rounded-md p-6 text-center text-sm">
					Giscus 환경변수(NEXT_PUBLIC_GISCUS_REPO / REPO_ID / CATEGORY / CATEGORY_ID) 설정 후 댓글이 활성화됩니다.
				</div>
			)}

			{config && !shouldLoad && (
				<div
					role="status"
					aria-live="polite"
					className="bg-muted text-muted-foreground min-h-32 rounded-md p-6 text-center text-sm"
				>
					스크롤하면 댓글이 로드됩니다.
				</div>
			)}
		</section>
	);
}
