import type { FuseResultMatch } from "fuse.js";

import type { PostSummary } from "@/entities/post";

export type SearchResult = {
	post: PostSummary;
	score: number;
	matches?: ReadonlyArray<FuseResultMatch>;
};
