import { Redis } from "@upstash/redis";

export function postViewsKey(slug: string) {
	return `views:post:${slug}`;
}

function readCredentials() {
	const url = process.env.UPSTASH_REDIS_REST_URL;
	const token = process.env.UPSTASH_REDIS_REST_TOKEN;

	return { url, token };
}

export function hasRedisCredentials() {
	const { url, token } = readCredentials();

	return Boolean(url) && Boolean(token);
}

let client: Redis | null = null;

export function getRedis() {
	if (!client) {
		client = Redis.fromEnv();
	}

	return client;
}
