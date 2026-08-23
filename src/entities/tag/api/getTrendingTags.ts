import type { TaggedPost } from "../model/tag";
import { getTagCounts } from "./getTagCounts";

const DEFAULT_LIMIT = 10;

export function getTrendingTags(posts: TaggedPost[], limit = DEFAULT_LIMIT) {
	return getTagCounts(posts).slice(0, limit);
}
