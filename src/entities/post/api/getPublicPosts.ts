import { cache } from "react";

import { getAllPosts } from "./getAllPosts";

export const getPublicPosts = cache(() => getAllPosts({ includePrivate: false }));
