import { Redis } from "@upstash/redis";

// Redis.fromEnv()는 UPSTASH_REDIS_REST_* 를 먼저 보고 없으면 KV_REST_API_* 로 떨어진다.
// 자격 검사가 같은 두 이름을 봐야 Vercel KV에서 옮겨온 환경과 새로 붙인 Upstash 환경이 모두 동작한다.
function readCredentials() {
	const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
	const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

	return { url, token };
}

export function hasRedisCredentials() {
	const { url, token } = readCredentials();

	return Boolean(url) && Boolean(token);
}

let client: Redis | null = null;

// fromEnv()는 자격이 없으면 throw한다. hasRedisCredentials()가 true인 것을 확인한 뒤에만 부른다.
export function getRedis() {
	if (!client) {
		client = Redis.fromEnv();
	}

	return client;
}
