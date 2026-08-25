"use client";

type GlobalErrorPageProps = {
	error: Error & { digest?: string };
	retry: () => void;
};

const STYLES = `
	:root {
		color-scheme: light dark;
		--ge-bg: #ffffff;
		--ge-text: #0f172a;
		--ge-muted: #475569;
		--ge-accent: #4f46e5;
		--ge-border: #cbd5e1;
	}

	@media (prefers-color-scheme: dark) {
		:root {
			--ge-bg: #09090b;
			--ge-text: #f8fafc;
			--ge-muted: #a1a1aa;
			--ge-accent: #818cf8;
			--ge-border: #3f3f46;
		}
	}

	body {
		margin: 0;
		min-height: 100svh;
		display: grid;
		place-items: center;
		padding: 24px;
		background: var(--ge-bg);
		color: var(--ge-text);
		font-family: system-ui, -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
		line-height: 1.7;
	}

	.ge-box {
		max-width: 34rem;
		text-align: center;
	}

	.ge-title {
		margin: 0 0 12px;
		font-size: 1.5rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.ge-desc {
		margin: 0 0 8px;
		color: var(--ge-muted);
		font-size: 0.9375rem;
	}

	.ge-digest {
		margin: 0 0 24px;
		color: var(--ge-muted);
		font-family: ui-monospace, SFMono-Regular, monospace;
		font-size: 0.8125rem;
	}

	.ge-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
		margin-top: 24px;
	}

	.ge-retry,
	.ge-home {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 44px;
		padding: 0 20px;
		border-radius: 8px;
		font-size: 0.875rem;
		font-weight: 600;
		text-decoration: none;
		cursor: pointer;
	}

	.ge-retry {
		border: 1px solid var(--ge-accent);
		background: var(--ge-accent);
		color: var(--ge-bg);
	}

	.ge-home {
		border: 1px solid var(--ge-border);
		background: transparent;
		color: var(--ge-text);
	}
	
	.ge-retry:focus-visible,
	.ge-home:focus-visible {
		outline: 2px solid var(--ge-accent);
		outline-offset: 2px;
	}
`;

export function GlobalErrorPage({ error, retry }: GlobalErrorPageProps) {
	return (
		<html lang="ko">
			<body>
				<title>오류가 발생했습니다 | chan9yu</title>
				<style>{STYLES}</style>
				<main className="ge-box">
					<h1 className="ge-title">페이지를 불러오지 못했습니다</h1>
					<p className="ge-desc">일시적인 문제일 수 있습니다. 다시 시도하거나 홈으로 이동해 주세요.</p>
					{error.digest && <p className="ge-digest">오류 코드 {error.digest}</p>}
					<div className="ge-actions">
						<button type="button" className="ge-retry" onClick={retry}>
							다시 시도
						</button>
						{/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
						<a className="ge-home" href="/">
							홈으로
						</a>
					</div>
				</main>
			</body>
		</html>
	);
}
