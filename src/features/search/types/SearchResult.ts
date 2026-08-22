import type { FuseResultMatch } from "fuse.js";

import type { PostSummary } from "@/shared/types";

export type SearchResult = {
	post: PostSummary;
	score: number;
	matches?: ReadonlyArray<FuseResultMatch>;
};
