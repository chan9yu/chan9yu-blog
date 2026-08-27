"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import type { PostSummary } from "@/entities/post";

import { useSearchShortcut } from "../model/useSearchShortcut";
import { SearchButton } from "./SearchButton";

const SearchModal = dynamic(() => import("./SearchModal").then((mod) => ({ default: mod.SearchModal })), {
	ssr: false
});

type SearchTriggerProps = {
	posts: PostSummary[];
};

export function SearchTrigger({ posts }: SearchTriggerProps) {
	const [open, setOpen] = useState(false);
	const [mounted, setMounted] = useState(false);

	const handleOpen = () => {
		setMounted(true);
		setOpen(true);
	};

	useSearchShortcut(handleOpen);

	return (
		<>
			<SearchButton onClick={handleOpen} />
			{mounted && <SearchModal open={open} onOpenChange={setOpen} posts={posts} />}
		</>
	);
}
