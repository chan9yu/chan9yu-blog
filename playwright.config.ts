import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI ? "list" : "html",
	use: {
		baseURL: BASE_URL,
		trace: "on-first-retry",
		screenshot: "only-on-failure"
	},
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
	webServer: {
		// CI는 프로덕션 빌드를 띄운다. dev 서버는 라우트마다 첫 요청에서 컴파일해
		// 콜드 스타트가 테스트 timeout을 넘긴다
		command: process.env.CI ? `pnpm build:strict && PORT=${PORT} pnpm start` : "pnpm dev",
		url: BASE_URL,
		reuseExistingServer: !process.env.CI,
		timeout: process.env.CI ? 300_000 : 120_000,
		stdout: "ignore",
		stderr: "pipe"
	}
});
